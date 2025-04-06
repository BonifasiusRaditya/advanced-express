const db = require("../database/pg.database");

exports.createTransaction = async ({ item_id, quantity, user_id }) => {
    try {
        const itemResult = await db.query("SELECT price FROM items WHERE id = $1", [item_id]);

        const price = itemResult.rows[0].price;
        const total = price * quantity;
        const transaction = await db.query(
            "INSERT INTO transactions (item_id, quantity, user_id, total) VALUES ($1, $2, $3, $4) RETURNING *",
            [item_id, quantity, user_id, total]
        );
        return transaction.rows[0];
    } catch (error) {
        console.error("Transaction Failed from Repository:", error);
        throw error;
    }
};

exports.payTransaction = async (id) => {
    try {
        console.log(id);
        const transactionResult = await db.query("SELECT * FROM transactions WHERE id = $1", [id]);
        if (transactionResult.rows.length === 0) {
            throw new Error("Transaction not found");
        }

        const transaction = transactionResult.rows[0];
        const user_id = transaction.user_id;
        const total = transaction.total;
        const item_id = transaction.item_id;
        const quantity = transaction.quantity;

        const userResult = await db.query("SELECT balance FROM users WHERE id = $1", [user_id]);
        const balance = userResult.rows[0].balance;
        const itemResult = await db.query("SELECT stock FROM items WHERE id = $1", [item_id]);
        const stock = itemResult.rows[0].stock;

        if(balance < total){
            throw new Error("Uang Gak Cukup");
        }   
        if(stock < quantity){
            throw new Error("Stock Gak Cukup");
        }
        const newBalance = balance - total;
        const newStock = stock - quantity;
        await db.query("UPDATE users SET balance = $1 WHERE id = $2", [newBalance, user_id]);
        await db.query("UPDATE items SET stock = $1 WHERE id = $2", [newStock, item_id]);

        // Update status transaksi dan return transaksi yang diperbarui
        const updatedTransaction = await db.query(
            "UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *", 
            [id]
        );

        return updatedTransaction.rows[0]; // Mengembalikan data transaksi yang telah diperbarui
    } catch (error) {
        console.error("Transaction Failed from Repository:", error);
        throw error;
    }
};

exports.deleteTransaction = async (id) => {
    try {
        const result = await db.query("DELETE FROM transactions WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Transaction Failed from Repository:", error);
        throw error;
    }
};

exports.getTransactions = async (id) => {
    try {
        const result = await db.query("SELECT * FROM transactions");
        return result.rows;
    } catch (error) {
        console.error("Transaction Failed from Repository:", error);
        throw error;
    }
};