import {makeStyles} from "@material-ui/core/styles";
import React, {useContext, useEffect, useRef, useState} from "react";
import {AlertContext, UserContext} from "../../context";
import {
    Button,
    Chip,
    Container,
    CssBaseline,
    FormControl,
    Icon,
    InputLabel,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem, Modal,
    Paper,
    Select,
    TextField,
    Typography
} from "@material-ui/core";
import List from "@material-ui/core/List";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import {be} from "../../constants/backendSetup";
import {getCORSHeaders} from "../../utils/fetchTools";
import {path_list} from "../../constants/routes";
import {Redirect} from "react-router-dom";
import {fileToBase64} from "../../utils/fileToBase64";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
    mainDiv: {
        margin: theme.spacing(3),
        marginBottom: theme.spacing(8),
        paddingBottom: theme.spacing(1),
        textAlign: "center"
    },
    textField: {
        width: "80%",
        margin: theme.spacing(1)
    },
    horizontalDiv: {
        display: "flex"
    },
    ingredientsList: {
        margin: theme.spacing(1),
        textAlign: "left"
    },
    floatingButton: {
        justifyContent: "center",
        alignContent: "center",
        margin: theme.spacing(1)
    },
    imageDiv: {
        margin: theme.spacing(1)
    },
    tag: {
        margin: theme.spacing(0.5),
    },
    tagsDiv: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    buttons: {
        margin: theme.spacing(1)
    }
}))

const fetchCreateRecipe = async (body, token) => {
    const url = be.PROFILE + "recipes/";
    const headers = getCORSHeaders(token);

    const res = await fetch(url, {
        headers,
        method: "POST",
        body: JSON.stringify(body)
    });

    if (res.status !== 201) {
        throw "Couldn't create recipe."
    }
}

async function fetchIngredientsList(token) {
    const url = be.INGREDIENTS;
    const headers = getCORSHeaders(token);

    const res = await fetch(url, {
        headers,
        method: "GET"
    });

    if (res.status !== 200) {
        throw "Couldn't get ingredients list"
    }

    return await res.json()
}

async function fetchNewIngredient(token, ingredient_name) {
    const url = be.INGREDIENTS;
    const headers = getCORSHeaders(token);

    const res = await fetch(url, {
        headers,
        method: "POST",
        body: JSON.stringify({
            ingredient_name: ingredient_name
        })
    });

    if (res.status !== 201) {
        throw "Couldn't add new ingredient"
    }
}

export default function NewRecipe() {
    const classes = useStyles();
    const user = useContext((UserContext))
    const alertC = useRef(useContext(AlertContext));
    const [recipeName, setRecipeName] = React.useState('');
    const [difficulty, setDifficulty] = React.useState('BG');
    const [quantity, setQuantity] = React.useState("0");
    const [ingredient, setIngredient] = React.useState('');
    const [unit, setUnit] = React.useState('g');
    const [timeUnit, setTimeUnit] = React.useState('min');
    const [time, setTime] = React.useState('1');
    const [mealType, setMealType] = React.useState('BF');
    const [ingredients, setIngredients] = React.useState([]);
    const [description, setDescription] = React.useState("")
    const [instruction, setInstruction] = React.useState("")
    const [redirect, setRedirect] = useState(undefined);
    const [isVisible, setVisible] = useState(false);
    const [photoData, setPhotoData] = useState("");
    const [tag, setTag] = useState("");
    const [tags, setTags] = React.useState([]);
    const [ingredientsList, setIngredientsList] = useState([]);
    const [open, setOpenModal] = React.useState(false);
    const filter = createFilterOptions();

    const handleClose = () => {
        setOpenModal(false);
    };

    const handleOpen = () => {
        setOpenModal(true);
    };

    useEffect(() => {
        loadIngredientList();
    }, [])

    const loadIngredientList = async () => {
        try {
            let res = await fetchIngredientsList(user.token);
            res.forEach((e) => e.title = e.ingredient_name)
            setIngredientsList(res)
        } catch (err) {
            alertC.current.showAlert(err, "error")
        }

    }

    const handleChangeDifficulty = (event) => {
        setDifficulty(event.target.value);
    };

    const handleChangeMealType = (event) => {
        setMealType(event.target.value);
    };

    const handleChangeUnit = (event) => {
        setUnit(event.target.value)
    }

    const handleChangeTimeUnit = (event) => {
        setTimeUnit(event.target.value)
    }

    const handleTagDelete = (tagToDelete) => () => {
        setTags((tags) => tags.filter((tag) => tag.key !== tagToDelete.key));
    };

    function generate() {
        return ingredients.map((value) => {
                const handleDeleteIngredient = (e) => {
                    e.preventDefault()
                    let newList = ingredients.filter((element) => element !== value)
                    setIngredients(newList)
                }
                const unit = value.unit !== "None" ? value.unit : ""
                let text = value.quantity + " " + unit + " " + value.ingredient
                let element = (<ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <PlayArrowIcon/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={text}
                    />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={handleDeleteIngredient}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>)
                return React.cloneElement(element);
            }
        );
    }

    const handleAddTag = (e) => {
        e.preventDefault()
        try {
            if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\d\s.,?!-()]+$/.test(tag)) {
                throw "Wrong tag format"
            }
            if (tags.filter((e) => e.label === tag).length !== 0) {
                throw "Tag already added"
            }
            let last_element = tags[tags.length - 1]
            let key_to_add = last_element === undefined ? -1 : last_element.key
            let element = {
                key: key_to_add + 1,
                label: tag
            }
            setTags([...tags, element])
            setTag("")
        } catch (err) {
            alertC.current.showAlert(err, "error")
        }
    }

    const handleAddIngredient = (e) => {
        e.preventDefault()
        try {
            if (!/^[\d.,]+$/.test(quantity)) {
                throw "Wrong quantity format"
            }
            if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s]+$/.test(ingredient)) {
                throw "Wrong ingredient format. Remember to add ingredient if it isn't on list."
            }

            const formula = {
                unit: unit,
                quantity: quantity,
                ingredient: ingredient
            }

            ingredients.forEach((element) => {
                if (JSON.stringify(element) === JSON.stringify(formula)) {
                    throw "Ingredient already in the list"
                }
            })
            setIngredients([
                ...ingredients, formula
            ]);
            setQuantity("0");
            setIngredient("");
        } catch (err) {
            alertC.current.showAlert(err, "error")
        }

    }

    const prepareIngredients = () => {
        let prepared = []
        ingredients.forEach((element) => {
            const unit = element.unit !== "None" ? element.unit : "";
            let ingredientList = [];
            ingredientList.push(element.ingredient);
            ingredientList.push(element.quantity);
            ingredientList.push(unit);
            prepared.push(ingredientList);
        })
        if (prepared.length === 0)
            throw "You have to add ingredients"
        return prepared;
    }

    const preparePrepTime = () => {
        if (time === "0") {
            throw "Time value can not be 0"
        }
        if (!/^[\d]+$/.test(time)) {
            throw "Wrong time value"
        }
        let day_format = time === "1" ? "day" : "days"
        let unit_format = timeUnit === "days" ? day_format : timeUnit
        return time + " " + unit_format
    }

    const prepareTags = () => {
        let prepared = []
        tags.forEach((e) => {
            prepared.push(e.label)
        })
        if (parseInt(time) < 20 && timeUnit === "min" && !prepared.includes("quick")){
            prepared.push("quick")
        }
        return prepared
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const pre_ingredients = prepareIngredients()
            const pre_prep_time = preparePrepTime()
            const pre_tags = prepareTags()
            let body = {
                recipe_name: recipeName,
                difficulty: difficulty,
                tags: pre_tags,
                ingredients: pre_ingredients,
                description: description,
                instructions: instruction,
                image_url: photoData,
                meal: mealType,
                prep_time: pre_prep_time
            }
            validateFields(body)
            await fetchCreateRecipe(body, user.token)
            alertC.current.showAlert("Successfully created recipe.", "success")
            setRedirect(path_list.PROFILE.route)
        } catch (err) {
            alertC.current.showAlert(err, "error")
        }
    }

    async function onFileSelected(event) {
        setVisible(true);
        let selectedFile = event.target.files[0];
        try {
            let b64 = await fileToBase64(selectedFile);
            setPhotoData(b64);
        } catch (err) {
            alertC.current.showAlert('Couldn\'t convert photo', "error");
        }
        if (selectedFile !== undefined) {
            let reader = new FileReader();

            let imgtag = document.getElementById("barcodeImg");
            imgtag.title = selectedFile.name;

            reader.onload = function (event) {
                imgtag.src = event.target.result;
            };

            reader.readAsDataURL(selectedFile);
        }
    }

    const validateFields = (body) => {
        if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\d\s:.,?!-()]+$/.test(body.recipe_name)) {
            throw "Wrong recipe name format"
        }
        if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\d\s]+$/.test(body.difficulty)) {
            throw "Wrong difficulty format"
        }
        if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\d\t\s:.,?!-()]+$/.test(body.description)) {
            throw "Wrong description format"
        }
        if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\d\t\s:.,?!-()]+$/.test(body.instructions)) {
            throw "Wrong instruction format"
        }
        if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\d\s]+$/.test(body.meal)) {
            throw "Wrong meal type format"
        }
        if (body.image_url.length === 0) {
            throw "You need to attach photo"
        }
        if (body.tags.length === 0) {
            throw "You need to attach tags"
        }
    }

    const body = (
        <div className={classes.modalPaper}>

        </div>
    );

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container fixed>
                <Paper>
                    <div className={classes.mainDiv}>
                        <TextField className={classes.textField} label="Recipe name"
                                   onChange={(e) => setRecipeName(e.target.value)}></TextField>
                        <FormControl className={classes.textField}>
                            <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={difficulty}
                                onChange={handleChangeDifficulty}
                            >
                                <MenuItem value={'BG'}>Beginner</MenuItem>
                                <MenuItem value={'IT'}>Intermediate</MenuItem>
                                <MenuItem value={'AD'}>Advanced</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.textField}>
                            <InputLabel id="demo-simple-select-label">Meal type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={mealType}
                                onChange={handleChangeMealType}
                            >
                                <MenuItem value={'BF'}>Breakfast</MenuItem>
                                <MenuItem value={'LU'}>Lunch</MenuItem>
                                <MenuItem value={'DN'}>Dinner</MenuItem>
                                <MenuItem value={'SU'}>Supper</MenuItem>
                            </Select>
                        </FormControl>
                        <div className={classes.horizontalDiv}>
                            <TextField className={classes.textField} label="Time" value={time}
                                       onChange={(e) => setTime(e.target.value)}></TextField>
                            <FormControl className={classes.textField}>
                                <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={timeUnit}
                                    onChange={handleChangeTimeUnit}
                                >
                                    <MenuItem value={'min'}>Minutes</MenuItem>
                                    <MenuItem value={'h'}>Hours</MenuItem>
                                    <MenuItem value={'days'}>Days</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className={classes.ingredientsList}>
                            <Typography variant="h6" className={classes.title}>
                                INGREDIENTS
                            </Typography>
                            <List dense={true}>
                                {generate()}
                            </List>
                        </div>
                        <div className={classes.horizontalDiv}>
                            <TextField className={classes.textField} label="Quantity" value={quantity}
                                       onChange={(e) => setQuantity(e.target.value)}></TextField>
                            <FormControl className={classes.textField}>
                                <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={unit}
                                    onChange={handleChangeUnit}
                                >
                                    <MenuItem value={'g'}>Grams</MenuItem>
                                    <MenuItem value={'kg'}>Kilograms</MenuItem>
                                    <MenuItem value={'lb'}>Pounds</MenuItem>
                                    <MenuItem value={''}>None</MenuItem>
                                    <MenuItem value={'tbsp'}>Tbsp</MenuItem>
                                    <MenuItem value={'tsp'}>Tsp</MenuItem>
                                    <MenuItem value={'ml'}>Milliliter</MenuItem>
                                    <MenuItem value={'l'}>Liter</MenuItem>
                                </Select>
                            </FormControl>
                            <Autocomplete
                                freeSolo
                                onChange={async (event, newValue) => {
                                    if (newValue && newValue?.id) {
                                        // timeout to avoid instant validation of the dialog's form.
                                        setIngredient(newValue?.ingredient_name)
                                    } else if (newValue) {
                                        try {
                                            if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s]+$/.test(newValue?.ingredient_name)) {
                                                throw "Wrong ingredient format"
                                            }
                                            if (ingredientsList.filter((e) => e.ingredient_name === newValue?.ingredient_name?.toLowerCase()).length !== 0) {
                                                throw "Ingredient already on list"
                                            }
                                            await fetchNewIngredient(user.token, newValue?.ingredient_name?.toLowerCase())
                                            setIngredient(newValue?.ingredient_name?.toLowerCase())
                                            loadIngredientList();
                                        } catch (err) {
                                            alertC.current.showAlert(err, "error")
                                        }
                                    } else {
                                        setIngredient("")
                                    }
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);

                                    if (params.inputValue !== '') {
                                        let element = {
                                            title: "Add " + params.inputValue,
                                            ingredient_name: params.inputValue,
                                        }
                                        filtered.push(element);
                                    }

                                    return filtered;
                                }}
                                options={ingredientsList}
                                getOptionLabel={(option) => {
                                    try {
                                        return option.title
                                    } catch (e) {
                                        console.log(e)
                                    }
                                }}
                                className={classes.textField}
                                renderInput={(params) => <TextField {...params} label="Ingredient" variant="outlined"/>}
                            />
                        </div>
                        <div className={classes.floatingButton}>
                            <Fab size="small" color="secondary" aria-label="add" className={classes.buttons}
                                 onClick={handleAddIngredient}>
                                <AddIcon/>
                            </Fab>
                        </div>
                        <TextField className={classes.textField} label="Description" multiline rows={4}
                                   onChange={(e) => setDescription(e.target.value)}></TextField>
                        <TextField className={classes.textField} label="Instructions" multiline rows={4}
                                   onChange={(e) => setInstruction(e.target.value)}></TextField>
                        <div>
                            {
                                isVisible ?
                                    <div className={classes.imageDiv}><img id="barcodeImg" height="200" alt=""/></div> :
                                    <div></div>
                            }
                        </div>

                        <TextField className={classes.textField} label="Tag" value={tag}
                                   onChange={(e) => setTag(e.target.value)}></TextField>

                        <div className={classes.floatingButton}>
                            <Fab size="small" color="secondary" aria-label="add" className={classes.margin}
                                 onClick={handleAddTag}>
                                <AddIcon/>
                            </Fab>
                        </div>
                        <div className={classes.tagsDiv}>
                            {tags.map((data) => {
                                let icon;

                                return (
                                    <li key={data.key}>
                                        <Chip
                                            icon={icon}
                                            label={data.label}
                                            onDelete={handleTagDelete(data)}
                                            className={classes.tag}
                                        />
                                    </li>
                                );
                            })}
                        </div>
                        <div>
                            <input
                                accept="image/*"
                                className={classes.input}
                                id="contained-button-file"
                                multiple
                                type="file"
                                onChange={e => onFileSelected(e)} hidden
                            />
                            <label htmlFor="contained-button-file">
                                <Button variant="contained" color="primary" component="span">
                                    Upload
                                </Button>
                            </label>
                        </div>
                        <div className={classes.floatingButton}>
                            <Button variant="contained" color="primary" endIcon={<Icon>send</Icon>}
                                    onClick={handleSubmit}>Submit</Button>
                        </div>

                    </div>
                    {redirect && <Redirect to={redirect}/>}
                </Paper>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>

            </Container>

        </React.Fragment>
    )
}