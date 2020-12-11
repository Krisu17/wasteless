import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import DrawerList from "./components/DrawerList";
import Zoom from "@material-ui/core/Zoom";
import {useScrollTrigger} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Slide from "@material-ui/core/Slide";
import {path_list} from "constants/routes";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing(3),
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    topAnchor: {
        position: "fixed",
        top: 0
    },
    appName: {

    }
}));

const ScrollToTop = (props) => {
    const {children, window} = props;
    const classes = useStyles();

    const handleClick = (event) => {
        const anchor = document.querySelector("#back-to-top-anchor");
        if (anchor) {
            anchor.scrollIntoView({behavior: "smooth", block: "center"});
        }
    };

    return (
        <Zoom in={useScrollTrigger({target: window, disableHysteresis: true, threshold: 100})}>
            <div onClick={handleClick} role="presentation" className={classes.fab}>
                {children}
            </div>
        </Zoom>
    )
};

const HideOnScroll = (props) => {
    const {children, window} = props;

    return (
        <Slide appear={false} direction="down" in={!useScrollTrigger({window})}>
            {children}
        </Slide>
    );
};

const MenuBar = (props) => {
    const history = useHistory();
    const { window } = props;
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [barName, setBarName] = useState(Object.values(path_list).filter((pathObject) => pathObject.route === history.location.pathname)[0]?.name || "");


    const redirectToPath = (path) => {
        setBarName(path.name);
        setMobileOpen(false);
        history.push(path.route);
    };

    const drawer = (
        <>
            <div className={classes.toolbar} >
                <Typography variant="h6" component="h6" className={classes.appName} aria-label="tu bedzie logo apki">
                    WastelessLogo
                </Typography>
            </div>
            <Divider />
            <DrawerList setRedirect={redirectToPath} />
            <Divider />
            <DrawerList setRedirect={redirectToPath} />
        </>
    );

    //const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <HideOnScroll {...props}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => setMobileOpen(true)}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            {barName}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <nav className={classes.drawer} aria-label="mailbox folders">
                <Hidden smUp implementation="css">
                    <SwipeableDrawer
                        container={window}
                        variant="temporary"
                        anchor="left"
                        open={mobileOpen}
                        onClose={() => setMobileOpen(false)}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                     onOpen={() => setMobileOpen(true)}>
                        {drawer}
                    </SwipeableDrawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <ScrollToTop {...props}>
                <Fab color="secondary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollToTop>
            <main className={classes.content}>
                <div id="back-to-top-anchor" className={classes.toolbar} />
                {props.children}
            </main>
        </div>
    );
}

export default MenuBar;