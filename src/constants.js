
/**
 * Object mapping between visualization names and the order in which they appear.
 * Each key is comprised of (1) the name of the ScrollView window from Tesseract and 
 * (2) the number of times that window name has been used.
 * For example, the second time a "With Images" window appears would be "With Images_2".
 * 
 * @type {{ [key: string]: number }}
 */
export const tableMapping = {
    "Filtered Input Blobs_1": 1,
    "LeaderNeighbours_1": 2,
    "VerticalLines_1": 3,
    "InitialTabs_1": 4,
    "Initial textline Blobs_1": 5,
    "InitialStrokewidths_1": 6,
    "ImprovedStrokewidths_1": 7,
    "Initial text chains_1": 8,
    "Projection_1": 9,
    "GoodTextline blobs_1": 10,
    "Diacritics_1": 11,
    "Smoothed blobs_1": 12,
    "With Images_1": 13,
    "With Images_2": 14,
    "VerticalLines_2": 15,
    "Rejected blobs_1": 16,
    "FinalTabs_1": 17,
    "Columns_1": 18,
    "InitialPartitions_1": 19,
    "Column Partitions & Neighbors_1": 20,
    "Fragmented Text_1": 21,
    "Final Table Partitions_1": 22,
    "Detected Tables_1": 23,
    "Partitions_1": 24,
    "Blocks_1": 25
};

/**
 * Object mapping between rgba colors used for drawing to canvas and color names used by Tesseract.
 * 
 * @type {{ [key: string]: string }}
 */
export const colorsMapping = {
    "rgba(0, 0, 0, 0)": "NONE",
    "rgba(0, 0, 0, 255)": "BLACK",
    "rgba(255, 255, 255, 255)": "WHITE",
    "rgba(255, 0, 0, 255)": "RED",
    "rgba(255, 255, 0, 255)": "YELLOW",
    "rgba(0, 255, 0, 255)": "GREEN",
    "rgba(0, 255, 255, 255)": "CYAN/TURQUOISE",
    "rgba(0, 0, 255, 255)": "BLUE",
    "rgba(255, 0, 255, 255)": "MAGENTA",
    "rgba(0, 128, 255, 255)": "AQUAMARINE",
    "rgba(0, 0, 64, 255)": "DARK_SLATE_BLUE",
    "rgba(128, 128, 255, 255)": "LIGHT_BLUE",
    "rgba(64, 64, 255, 255)": "MEDIUM_BLUE",
    "rgba(0, 0, 32, 255)": "MIDNIGHT_BLUE",
    "rgba(0, 0, 128, 255)": "NAVY_BLUE",
    "rgba(192, 192, 255, 255)": "SKY_BLUE",
    "rgba(64, 64, 128, 255)": "SLATE_BLUE/DARK_SLATE_GREY",
    "rgba(32, 32, 64, 255)": "STEEL_BLUE",
    "rgba(255, 128, 128, 255)": "CORAL",
    "rgba(128, 64, 0, 255)": "BROWN",
    "rgba(128, 128, 0, 255)": "SANDY_BROWN/TAN/WHEAT",
    "rgba(192, 192, 0, 255)": "GOLD",
    "rgba(192, 192, 128, 255)": "GOLDENROD",
    "rgba(0, 64, 0, 255)": "DARK_GREEN",
    "rgba(32, 64, 0, 255)": "DARK_OLIVE_GREEN",
    "rgba(64, 128, 0, 255)": "FOREST_GREEN",
    "rgba(128, 255, 0, 255)": "LIME_GREEN/GREEN_YELLOW",
    "rgba(192, 255, 192, 255)": "PALE_GREEN",
    "rgba(192, 255, 0, 255)": "YELLOW_GREEN",
    "rgba(192, 192, 192, 255)": "LIGHT_GREY",
    // "rgba(64, 64, 128, 255)": "DARK_SLATE_GREY",
    "rgba(64, 64, 64, 255)": "DIM_GREY",
    "rgba(128, 128, 128, 255)": "GREY",
    "rgba(64, 192, 0, 255)": "KHAKI",
    "rgba(255, 0, 192, 255)": "MAROON/VIOLET_RED",
    "rgba(255, 128, 0, 255)": "ORANGE",
    "rgba(255, 128, 64, 255)": "ORCHID",
    "rgba(255, 192, 192, 255)": "PINK",
    "rgba(128, 0, 128, 255)": "PLUM",
    "rgba(255, 0, 64, 255)": "INDIAN_RED",
    "rgba(255, 64, 0, 255)": "ORANGE_RED",
    // "rgba(255, 0, 192, 255)": "VIOLET_RED",
    "rgba(255, 192, 128, 255)": "SALMON",
    // "rgba(128, 128, 0, 255)": "TAN",
    // "rgba(0, 255, 255, 255)": "TURQUOISE",
    "rgba(0, 128, 128, 255)": "DARK_TURQUOISE",
    "rgba(192, 0, 255, 255)": "VIOLET",
    // "rgba(128, 128, 0, 255)": "WHEAT",
    // "rgba(128, 255, 0, 255)": "GREEN_YELLOW"
};

