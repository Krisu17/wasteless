import NewProduct from "../Pages/NewProduct";
import FridgesList from "../Pages/FridgesList/FridgesList";
import ProductsList from "../Pages/ProductsList/ProductsList"
import UserPage from "../Pages/UserPage/UserPage";
import LoginPage from "Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import NewRecipe from "../Pages/NewRecipe/NewRecipe";
import RecipePage from "../Pages/RecipePage/RecipePage";
import RecipesList from "../Pages/RecipesList/RecipesList";
import SendResetEmail from "../Pages/ResetPassword/SendResetEmail";
import ResetPassword from "../Pages/ResetPassword/ResetPassword";


export const path_list = {
    DASHBOARD: {
        route: "/",
        name: "Dashboard"
    },
    REGISTER: {
        route: "/register",
        name: "Register"
    },
    LOGIN: {
        route: "/login",
        name: "Log in"
    },
    PROFILE: {
        route: "/user",
        name: "My profile"
    },
    SETTINGS: {
        route: "/settings",
        name: "Settings"
    },
    FRIDGE_LIST: {
        route: "/user/fridge",
        name: "My fridge list"
    },
    FRIDGE: {
        route: "/user/fridge/:fridge_id",
        redirect: (fridge_id) => `/user/fridge/${fridge_id}`,
        name: "My fridge"
    },
    FRIDGE_NEW_PRODUCT: {
        route: "/user/fridge/:fridge_id/new-product",
        redirect: (fridge_id) => `/user/fridge/${fridge_id}/new-product`,
        name: "Add product"
    },
    RECIPES_LIST: {
        route: "/recipes",
        name: "Recipes list"
    },
    NEW_RECIPE: {
        route: "/user/recipe/new-recipe",
        name: "Add recipe"
    },
    RECIPE_PAGE: {
        route: "/recipes/:recipe_id",
        redirect: (recipe_id) => `/recipes/${recipe_id}`,
        name: "Recipe details"
    },
    RESET_PASSWORD_REQUEST: {
        route: "/reset_password",
        name: "Send reset password email"
    },
    RESET_PASSWORD: {
        route: "/password-reset/:reset_token",
        redirect: (reset_token) => `/password-reset/${reset_token}`,
        name: "Reset password"
    }
}

export default [
    {
        path: path_list.FRIDGE.route,
        component: ProductsList,
        exact: true
    },
    {
        path: path_list.LOGIN.route,
        component: LoginPage,
        exact: true
    },
    {
        path: path_list.REGISTER.route,
        component: RegisterPage,
        exact: true
    },
    {
        path: path_list.PROFILE.route,
        exact: true,
        component: UserPage
    },
    {
        path: path_list.FRIDGE_LIST.route,
        exact: true,
        component: FridgesList
    },
    {
        path: path_list.FRIDGE_NEW_PRODUCT.route,
        component: NewProduct,
        exact: true
    },
    {
        path: path_list.NEW_RECIPE.route,
        component: NewRecipe,
        exact: true
    },
    {
        path: path_list.RECIPE_PAGE.route,
        component: RecipePage,
        exact: true
    },
    {
        path: path_list.RECIPES_LIST.route,
        component: RecipesList,
        exact: true
    },
    {
        path: path_list.RESET_PASSWORD_REQUEST.route,
        component: SendResetEmail,
        exact: true
    },
    {
        path: path_list.RESET_PASSWORD.route,
        component: ResetPassword,
        exact: false
    },
];

