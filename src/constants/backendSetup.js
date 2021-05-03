const backend_path = process.env.REACT_APP_BACKEND_PATH;
const product_api = process.env.REACT_APP_FOODFACTS_API;

export const be = {
    PLAIN: `${backend_path}/`,
    FRIDGE: `${backend_path}/fridges/`,
    PRODUCTS: `${backend_path}/products/`,
    USERS: `${backend_path}/users/`,
    LOGIN: `${backend_path}/login/`,
    LOGOUT: `${backend_path}/logout/`,
    REGISTER: `${backend_path}/register/`,
    RECIPE: `${backend_path}/recipes/`,
    COMMENTS: `${backend_path}/comments/`,
    PROFILE: `${backend_path}/profile/`,
    RECIPES_LIST: `${backend_path}/recipes`,
    REQUEST_RESET_EMAIL: `${backend_path}/password-reset/`,
    VALIDATE_RESET_TOKEN: `${backend_path}/password-reset/validate_token/`,
    RESET_PASSWORD: `${backend_path}/password-reset/confirm/`,
    INGREDIENTS: `${backend_path}/ingredients/`,
};

export const off_API = `${product_api}/product/`;