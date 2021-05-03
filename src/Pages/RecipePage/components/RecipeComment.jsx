import React, {useEffect, useState} from 'react';
import {getCORSHeaders} from "../../../utils/fetchTools";
import {CircularProgress, ListItem, ListItemAvatar, ListItemText, Paper} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import Avatar from "@material-ui/core/Avatar";
import {be} from "../../../constants/backendSetup";
import {makeStyles} from "@material-ui/core/styles";

const fetchComment = async (data, token) => {
    const url = `${be.COMMENTS}${data.id}/`;
    const headers = getCORSHeaders(data.token);

    const res = await fetch(url, {
        headers,
        method: "GET"
    });

    if (res.status === 200) {
        return await res.json();
    } else {
        throw res.status;
    }
};

const useStyles = makeStyles((theme) => ({
    comment: {
        marginBottom: theme.spacing(1),
    }
}))

const mapRes = (data) => ({
    ...data,
    date_added: (() => {
        const nd = new Date(data.date_added);
        return nd.getDate() + "." + (nd.getMonth() + 1) + "." + nd.getFullYear();
    })(),
});

const RecipeComment = (id, token) => {
    const [details, setDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const classes = useStyles();

    useEffect(() => {
       const loadComment = async () => {
           setLoading(true);
           try {
               const res = await fetchComment(id, token);
               setDetails( mapRes(res) );
           } catch(ex) {
               setError(true);
           } finally {
               setLoading(false);
           }
       };
       loadComment();
    }, [id]);

    return loading ? (
        <CircularProgress />
    ) : (
        <Paper elevation={3} className={classes.comment}>
            {error ? (
                <Alert severity="danger">
                    There was an error viewing this comment.
                </Alert>
            ) : (
                <>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                {details?.author_name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={details.content}
                            secondary={`Author: ${details.author_name}, date added: ${details.date_added}`}
                        />
                    </ListItem>
                </>
            )}
        </Paper>
    )
};

export default RecipeComment;