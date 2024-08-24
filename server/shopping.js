function shopping(products, shoppingList) {
    // Step 1: Create a map of products to departments
    const productToDepartment = new Map(products);

    // Step 2: Track the number of department visits in order and in the optimized manner
    const departmentsInOrder = new Set();
    let lastDepartment = null;
    let visitsInOrder = 0;

    for (const item of shoppingList) {
        const department = productToDepartment.get(item);
        if (department !== lastDepartment) {
            visitsInOrder++;
            lastDepartment = department;
        }
        departmentsInOrder.add(department);
    }

    // Step 3: Calculate the number of visits optimized by grouping departments
    const visitsOptimized = departmentsInOrder.size;

    // Step 4: Compute the time saved
    return visitsInOrder - visitsOptimized;
}

// Test cases
const products = [
    ["Cheese",          "Dairy"],
    ["Carrots",         "Produce"],
    ["Potatoes",        "Produce"],
    ["Canned Tuna",     "Pantry"],
    ["Romaine Lettuce", "Produce"],
    ["Chocolate Milk",  "Dairy"],
    ["Flour",           "Pantry"],
    ["Iceberg Lettuce", "Produce"],
    ["Coffee",          "Pantry"],
    ["Pasta",           "Pantry"],
    ["Milk",            "Dairy"],
    ["Blueberries",     "Produce"],
    ["Pasta Sauce",     "Pantry"]
];

const list1 = ["Blueberries", "Milk", "Coffee", "Flour", "Cheese", "Carrots"];
const list2 = ["Blueberries", "Carrots", "Coffee", "Milk", "Flour", "Cheese"];
const list3 = ["Blueberries", "Carrots", "Romaine Lettuce", "Iceberg Lettuce"];
const list4 = ["Milk", "Flour", "Chocolate Milk", "Pasta Sauce"];
const list5 = ["Cheese", "Potatoes", "Blueberries", "Canned Tuna"];

// Running test cases
console.log(shopping(products, list1));  // => 2
console.log(shopping(products, list2));  // => 2
console.log(shopping(products, list3));  // => 0
console.log(shopping(products, list4));  // => 2
console.log(shopping(products, list5));  // => 0