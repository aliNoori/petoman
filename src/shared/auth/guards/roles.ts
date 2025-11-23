// roles.ts
import { RolesBuilder } from 'nest-access-control';
import { UserRole } from "../../user/entities/user.entity";

export const roles: RolesBuilder = new RolesBuilder();

// -------------------- SUBSCRIBER --------------------
roles
    .grant(UserRole.SUBSCRIBER)
    .readOwn('user')
    .readOwn('posts')
    .readOwn('donations')
    .readOwn('kindness_meetings');

// -------------------- ADMIN --------------------
roles
    .grant(UserRole.ADMIN)
    .extend(UserRole.SUBSCRIBER)
    // Users
    .createAny('users')
    .updateAny('users')
    .deleteAny('users')
    // Posts
    .createAny('posts')
    .updateAny('posts')
    .deleteAny('posts')
    // Categories & Tags
    .createAny('categories')
    .updateAny('categories')
    .deleteAny('categories')
    .createAny('tags')
    .updateAny('tags')
    .deleteAny('tags')
    // Pages
    .createAny('pages')
    .updateAny('pages')
    .deleteAny('pages')
    // Settings
    .updateAny('general_settings')
    .updateAny('appearance_settings')
    .updateAny('seo_settings')
    .updateAny('schema_settings')
    .updateAny('open_graph_settings')
    .updateAny('payment_settings')
    // Danim Settings
    .updateAny('danim_general_settings')
    .updateAny('danim_home_page_settings')
    .updateAny('danim_open_graph_settings')
    .updateAny('danim_performance_settings')
    .updateAny('danim_seo_settings')
    .updateAny('danim_schema_settings')
    .createAny('danim_pages')
    .updateAny('danim_pages')
    .deleteAny('danim_pages')
    // Supporters
    .readAny('supporters')
    .updateAny('supporters')
    .readAny('donations')
    // Other tables
    .updateAny('faqs')
    .updateAny('uploads');

// -------------------- SUPPORTER_ADMIN --------------------
roles
    .grant(UserRole.SUPPORTER_ADMIN)
    .readAny('supporters')
    .createAny('supporters')
    .updateAny('supporters')
    .readAny('donations')
    .updateAny('donations');

// -------------------- DANIM_ADMIN --------------------
roles
    .grant(UserRole.DANIM_ADMIN)
    .createAny('danim_pages')
    .updateAny('danim_pages')
    .deleteAny('danim_pages')
    .updateAny('danim_general_settings')
    .updateAny('danim_home_page_settings')
    .updateAny('danim_open_graph_settings')
    .updateAny('danim_performance_settings')
    .updateAny('danim_seo_settings')
    .updateAny('danim_schema_settings');

// -------------------- FILM_ADMIN --------------------
roles
    .grant(UserRole.FILM_ADMIN)
    .createAny('documentaries')
    .updateAny('documentaries')
    .deleteAny('documentaries');

// -------------------- MARKET_ADMIN --------------------
roles
    .grant(UserRole.MARKET_ADMIN)
    .readAny('payment_settings')
    .updateAny('payment_settings');

// -------------------- VET_ADMIN --------------------
roles
    .grant(UserRole.VET_ADMIN)
    .updateAny('kindness_meetings');

// -------------------- Editor --------------------
roles
    .grant(UserRole.Editor)
    .updateAny('posts')
    .updateAny('pages');

// -------------------- Author --------------------
roles
    .grant(UserRole.Author)
    .createOwn('posts')
    .updateOwn('posts');
