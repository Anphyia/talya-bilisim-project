// Main API Response Structure
export type RestaurantApiResponse = {
    hotelParam: HotelParam;
    menuGroupArr: MenuGroup[];
    menuArr: MenuItem[];
    basketMenu: BasketMenu[];
    basketMenuDetail: BasketMenuDetail[];
    itemExtras: ItemExtra[];
    tables: Table[];
};

// Hotel/Restaurant Parameter Configuration
export type HotelParam = {
    ID: number;
    DEPID: number;
    NAME: string;
    LOGO: string;
    DEPARTMENTNAME: string;
    PHONE: string;
    ADDRESS: string | null;
    UID: string;
    POSBOOKING_CLOUDFLARE_ISNOTUSED: boolean;
    POSCURRENCYID: number;
    POSCURRENCYCODE: string;
    POSBOOKING_ORDERBUTTONACTIVE: boolean;
    POSBOOKING_ASKFORTABLENO: string | null;
    ALLERGENSTBL: string; // JSON string containing allergen data
    POSBOOKING_MENUDESIGNID: number;
    HOTELTIME: string | null;
    HOUROFFSET: string;
    ISEPTERA: boolean;
    POSBOOKING_RULES: string; // HTML string
    POSBOOKING_NUMBEROFPEOPLE_TEXT: string; // HTML string
    POSBOOKING_TABLESELECTIONACTIVE: boolean;
    POSBOOKING_DONOTSHOW_ENDTIMES_INTHERESERVATION: boolean;
};

// Menu Group/Category
export type MenuGroup = {
    ID: number;
    NAME: string;
    DISPLAYORDER: number;
    PRODUCTTYPEID: number | null;
    PARENTGROUPID: number | null;
    PHOTOURL: string;
    I18N: string | null;
};

// Menu Item/Product
export type MenuItem = {
    ID: number;
    NAME: string;
    PHOTOURL: string;
    PRICE: number;
    CURRENCYCODE: string;
    CURRENCYSYMBOL: string;
    GROUPID: number;
    GROUPNAME: string;
    DISPLAYINFO: string | null;
    ALLERGIC: boolean;
    VEGETARIAN: boolean;
    ALCOHOL: boolean;
    PORK: boolean;
    GLUTEN: boolean;
    PRODUCTTYPEID: number;
    COURSENO: number | null;
    ALLERGENS: string | null;
    DISPLAYORDER: number;
    SALESDEPID: number | null;
    I18N: string | null;
    DISPLAYINFO_I18N: string | null;
};

// Basket Menu (Menu Categories/Sections)
export type BasketMenu = {
    ID: number;
    NAME: string;
    DISPLAYORDER: number;
    SALESTARTHOUR: string; // DateTime string
    SALEENDHOUR: string; // DateTime string
    PHOTOURL: string;
    USE_DEPARTMENT_PRODUCTS: boolean;
    DEPIDS: string; // Comma-separated department IDs
};

// Basket Menu Detail (Relationship between menus and products) 
export type BasketMenuDetail = {
    ID: number;
    MENUID: number;
    PRODUCTGROUPID: number;
    DISPLAYORDER: number | null;
    PRODUCTID: number;
};

// Item Extras (Add-ons/Modifiers for menu items)
export type ItemExtra = {
    ID: number;
    NAME: string;
    PRICE: number;
    PRODUCTID: number;
    GROUPNAME: string | null;
    MULTISELECT: boolean;
};

// Restaurant Tables
export type Table = {
    ID: number;
    UID: string;
    TABLENO: string;
    BOOKINGFEE: number;
    TABLEGROUP: string;
    PAXCOUNT: number; // Maximum number of people
};


// Optional: Parsed allergen structure (from ALLERGENSTBL JSON string)
export type Allergen = {
    ID: number;
    NAME: string;
    TR_NAME: string;
};