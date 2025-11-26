import { sql } from "../config/db.js";

// ================= GET TRANSACTIONS =================
export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log("Fetching transactions for user:", userId);

    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting the transactions:", error);
    res.status(500).json({ message: "Internal error while fetching transactions" });
  }
}

// ================= CREATE TRANSACTION =================
export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    console.log("Creating transaction:", req.body);

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error creating the transaction:", error);
    res.status(500).json({ message: "Internal error while creating transaction" });
  }
}

// ================= DELETE TRANSACTION =================
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    console.log("Deleting transaction id:", id);

    const result = await sql`
      DELETE FROM transactions 
      WHERE id = ${id} 
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting the transaction:", error);
    res.status(500).json({ message: "Internal error while deleting transaction" });
  }
}

// ================= GET SUMMARY =================
export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log("Fetching summary for user:", userId);

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions 
      WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions 
      WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses
      FROM transactions 
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.error("Error getting the summary:", error);
    res.status(500).json({ message: "Internal error while fetching summary" });
  }
}
