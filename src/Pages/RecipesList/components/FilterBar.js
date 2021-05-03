import {makeStyles} from "@material-ui/core/styles";
import React, {useContext, useEffect, useRef} from "react";
import {
    Button, Chip,
    Container,
    FormControl,
    Icon,
    InputBase,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select, TextField, Typography
} from "@material-ui/core";
import {AlertContext, UserContext} from "../../../context";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {getCORSHeaders} from "../../../utils/fetchTools";
import {be} from "../../../constants/backendSetup";
import {path_list} from "../../../constants/routes";

const useStyles = makeStyles((theme) => ({
    mainDiv: {
        margin: theme.spacing(3),
        marginBottom: theme.spacing(4),
        paddingBottom: theme.spacing(1),
        textAlign: "left",
        display: "flex"
    },
    textField: {
        width: "100%",
    },
    iconButton: {
        padding: 10,
    },
    sorting: {
        width: "40%",
        justifyContent: "center"
    },
    filterBtn: {
        textAlign: "center",
        justifyContent: "center",
        margin: theme.spacing(1),
        marginLeft: theme.spacing(3)
    },
    modalPaper: {
        position: 'absolute',
        width: "60%",
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: "25%",
        left: "35%",
        transform: `translate(-20%, -40%)`,
    },
    searchDiv: {
        justifyContent: "center",
        margin: theme.spacing(1),
    },
    modalDiv: {
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
        margin: theme.spacing(1)
    },
    horizontalDiv: {
        display: "flex"
    },
    tagsDiv: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    flex: {
        margin: theme.spacing(3)
    }
}))

export default function FilterBar(props) {
    const classes = useStyles();
    const [sort, setSort] = React.useState('pd');
    const [difficulty, setDifficulty] = React.useState('none');
    const [open, setOpenModal] = React.useState(false);
    const alertC = useRef(useContext(AlertContext));
    const [tag, setTag] = React.useState("");
    const [tags, setTags] = React.useState([]);
    const [ingredient, setIngredient] = React.useState("");
    const [ingredients, setIngredients] = React.useState([]);
    const [mealType, setMealType] = React.useState('none');
    const user = useContext((UserContext))
    const [searchValue, setSearchValue] = React.useState('');

    const handleClose = () => {
        setOpenModal(false);
    };

    const handleOpen = () => {
        setOpenModal(true);
    };

    const handleChangeSort = async (event) => {
        setSort(event.target.value)
    }

    const firstUpdate = useRef(true);

    useEffect(() => {
        if(firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        filterList();
    }, [sort, open])

    const handleChangeDifficulty = (event) => {
        setDifficulty(event.target.value)
    }

    const handleChangeMealType = (event) => {
        setMealType(event.target.value);
    };

    const handleTagDelete = (tagToDelete) => () => {
        setTags((tags) => tags.filter((tag) => tag.key !== tagToDelete.key));
    };

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

    const handleSave = async(e) => {
        e.preventDefault();
        setOpenModal(false);
    }

    const handleIngredientDelete = (ingredientToDelete) => () => {
        setIngredients((ingredients) => ingredients.filter((ingredient) => ingredient.key !== ingredientToDelete.key));
    };

    function createParams() {
        let returnValue = "&"
        if (searchValue !== "") {
            returnValue += "name=" + searchValue + "&";
        }
        if (ingredients.length !== 0) {
            let text = "{"
            ingredients.forEach((element) => {
                text += "\"" + element.label + "\","
            })
            text =text.slice(0, -1)
            text += "}"
            returnValue += "ingredients=" + text + "&";
        }
        if (tags.length !== 0) {
            let text = "{"
            tags.forEach((element) => {
                text += "\"" + element.label + "\","
            })
            text = text.slice(0, -1)
            text += "}"
            returnValue += "tags=" + text + "&";
        }
        if (difficulty !== "none") {
            returnValue += "difficulty=" + difficulty + "&";
        }
        if (mealType !== "none") {
            returnValue += "meal=" + mealType + "&";
        }
        returnValue += "order=" + sort;
        return returnValue;
    }

    const fetchFiltered = async (token) => {
        const headers = getCORSHeaders(token);
        let params = createParams()
        const url = be.RECIPE + params
        let res = await fetch(url, {
            headers
        });
        if (res.status === 200) {
            return await res.json();
        } else if (res.status === 401) {
            alertC.current.showAlert("You have to be logged in to see recipes", "error");
            return null;
        } else {
            alertC.current.showAlert("Something went wrong while trying to fetch recipe list", "error");
        }
    }

    function validateParams() {
        if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s\d.,?!-()]*$/.test(searchValue)) {
            throw "Wrong search text format"
        }
        ingredients.forEach((element) => {
            if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s\d.,?!-()]*$/.test(element.label)) {
                throw "Wrong ingredient format"
            }
        })

        tags.forEach((element) => {
            if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s\d.,?!-()]*/.test(element.label)) {
                throw "Wrong tag format"
            }
        })
    }

    const filterList = async () => {
        props.setLoading(true);
        try {
            validateParams();
            let params = createParams();
            props.setFilterParams(params);
            // let res = await fetchFiltered(user.token);
            // if (res !== null) {
            //     await props.setRecipes(res.results);
            //     await props.setCount(res.count);
            //     await props.setNext(res.next);
            //     await props.setPrevious(res.previous);
            // } else {
            //     props.setRedirect(path_list.LOGIN.route);
            // }
        } catch (err) {
            alertC.current.showAlert(err, "error");
        } finally {
            props.setLoading(false);
        }
    }

    const handleAddIngredient = (e) => {
        e.preventDefault()
        try {
            if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\d\s.,?!-()]+$/.test(ingredient)) {
                throw "Wrong ingredient format"
            }
            if (ingredients.filter((e) => e.label === ingredient).length !== 0) {
                throw "Ingredient already added"
            }
            let last_element = ingredients[ingredients.length - 1]
            let key_to_add = last_element === undefined ? -1 : last_element.key
            let element = {
                key: key_to_add + 1,
                label: ingredient
            }
            setIngredients([...ingredients, element])
            setIngredient("")
        } catch (err) {
            alertC.current.showAlert(err, "error")
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        await filterList();
    }

    const body = (
        <div className={classes.modalPaper}>
            <div className={classes.flex}>
                <div className={classes.modalDiv}>
                    <Typography variant="h6" className={classes.title}>
                        DIFFICULTY
                    </Typography>
                    <FormControl className={classes.textField}>
                        <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={difficulty}
                            onChange={handleChangeDifficulty}
                        >
                            <MenuItem value={'none'}>All</MenuItem>
                            <MenuItem value={'BG'}>Beginner</MenuItem>
                            <MenuItem value={'IT'}>Intermediate</MenuItem>
                            <MenuItem value={'AD'}>Advanced</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className={classes.modalDiv}>
                    <Typography variant="h6" className={classes.title}>
                        TAGS
                    </Typography>
                    <div className={classes.horizontalDiv}>
                        <TextField className={classes.textField} label="Tag" value={tag}
                                   onChange={(e) => setTag(e.target.value)}></TextField>
                        <div className={classes.floatingButton}>
                            <Fab size="small" color="secondary" aria-label="add" className={classes.margin}
                                 onClick={handleAddTag}>
                                <AddIcon/>
                            </Fab>
                        </div>
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
                </div>
                <div className={classes.modalDiv}>
                    <Typography variant="h6" className={classes.title}>
                        INGREDIENTS
                    </Typography>
                    <div className={classes.horizontalDiv}>
                        <TextField className={classes.textField} label="Ingredient" value={ingredient}
                                   onChange={(e) => setIngredient(e.target.value)}></TextField>
                        <div className={classes.floatingButton}>
                            <Fab size="small" color="secondary" aria-label="add" className={classes.margin}
                                 onClick={handleAddIngredient}>
                                <AddIcon/>
                            </Fab>
                        </div>
                    </div>
                    <div className={classes.tagsDiv}>
                        {ingredients.map((data) => {
                            let icon;

                            return (
                                <li key={data.key}>
                                    <Chip
                                        icon={icon}
                                        label={data.label}
                                        onDelete={handleIngredientDelete(data)}
                                        className={classes.tag}
                                    />
                                </li>
                            );
                        })}
                    </div>
                </div>
                <div className={classes.modalDiv}>
                    <Typography variant="h6" className={classes.title}>
                        TYPE
                    </Typography>
                    <FormControl className={classes.textField}>
                        <InputLabel id="demo-simple-select-label">Meal type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={mealType}
                            onChange={handleChangeMealType}
                        >
                            <MenuItem value={'none'}>All</MenuItem>
                            <MenuItem value={'BF'}>Breakfast</MenuItem>
                            <MenuItem value={'LU'}>Lunch</MenuItem>
                            <MenuItem value={'DN'}>Dinner</MenuItem>
                            <MenuItem value={'SP'}>Supper</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={classes.filterBtn}>
                <Button variant="contained" color="primary" endIcon={<Icon>save</Icon>}
                        onClick={handleSave}>Save</Button>
            </div>
        </div>
    );

    return (
        <div>
            <Paper>
                <div className={classes.mainDiv}>
                    <div className={classes.searchDiv}>
                        <InputBase
                            placeholder="Search"
                            inputProps={{'aria-label': 'search google maps'}}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <IconButton type="submit" className={classes.iconButton} aria-label="search"
                                    onClick={handleSearch}>
                            <SearchIcon/>
                        </IconButton>
                    </div>

                    <FormControl className={classes.sorting}>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sort}
                            onChange={handleChangeSort}
                        >
                            <MenuItem value={'pd'}>Popularity <ArrowDropDownIcon/> </MenuItem>
                            <MenuItem value={'pa'}>Popularity <ArrowDropUpIcon/> </MenuItem>
                            <MenuItem value={'rd'}>Ranking <ArrowDropDownIcon/></MenuItem>
                            <MenuItem value={'ra'}>Ranking <ArrowDropUpIcon/></MenuItem>
                            <MenuItem value={'na'}>Name <ArrowDropDownIcon/></MenuItem>
                            <MenuItem value={'nd'}>Name <ArrowDropUpIcon/></MenuItem>
                            {/*<MenuItem value={'ta'}>Time <ArrowDropDownIcon/> </MenuItem>*/}
                            {/*<MenuItem value={'td'}>Time <ArrowDropUpIcon/></MenuItem>*/}
                        </Select>
                    </FormControl>
                    <div className={classes.filterBtn}>
                        <Button variant="contained" color="primary" endIcon={<Icon>check</Icon>}
                                onClick={handleOpen}>Filter</Button>
                    </div>
                </div>

            </Paper>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>

    )
}