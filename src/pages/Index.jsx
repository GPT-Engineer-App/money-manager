import React, { useState } from "react";
import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Select, Table, Tbody, Td, Th, Thead, Tr, IconButton, useToast, Text } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaFileDownload } from "react-icons/fa";

const initialTransactions = [
  { id: 1, date: "2023-01-01", amount: 1000, type: "income", category: "salary" },
  { id: 2, date: "2023-01-10", amount: 50, type: "expense", category: "groceries" },
  // ... more transactions
];

const Index = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    type: "income",
    category: "salary",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: isEditing ? editingId : Math.max(...transactions.map((t) => t.id)) + 1,
      ...formData,
    };

    if (isEditing) {
      setTransactions(transactions.map((transaction) => (transaction.id === editingId ? newTransaction : transaction)));
    } else {
      setTransactions([...transactions, newTransaction]);
    }

    setFormData({
      date: "",
      amount: "",
      type: "income",
      category: "salary",
    });
    setIsEditing(false);
    setEditingId(null);

    toast({
      title: isEditing ? "Transaction Updated" : "Transaction Added",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEdit = (id) => {
    const transaction = transactions.find((t) => t.id === id);
    setFormData({
      date: transaction.date,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
    });
    setIsEditing(true);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
    toast({
      title: "Transaction Deleted",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleExport = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(transactions, null, 2))}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transactions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, curr) => {
      return curr.type === "income" ? acc + curr.amount : acc - curr.amount;
    }, 0);
  };

  return (
    <Container maxW="container.md" py={5}>
      <Heading mb={10}>Budgeting App</Heading>

      <Box as="form" onSubmit={handleSubmit} mb={10}>
        <Flex gap={4} mb={4}>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
          </FormControl>
          <FormControl>
            <FormLabel>Amount</FormLabel>
            <Input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required />
          </FormControl>
        </Flex>
        <Flex gap={4} mb={4}>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select name="type" value={formData.type} onChange={handleInputChange} required>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select name="category" value={formData.category} onChange={handleInputChange} required>
              <option value="salary">Salary</option>
              <option value="groceries">Groceries</option>
              <option value="bills">Bills</option>
              {/* ... other categories */}
            </Select>
          </FormControl>
        </Flex>
        <Button leftIcon={<FaPlus />} colorScheme="blue" type="submit">
          {isEditing ? "Update Transaction" : "Add Transaction"}
        </Button>
      </Box>

      <Box mb={10}>
        <Heading size="md" mb={4}>
          Transactions
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Type</Th>
              <Th>Category</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>{transaction.date}</Td>
                <Td>{transaction.amount}</Td>
                <Td>{transaction.type}</Td>
                <Td>{transaction.category}</Td>
                <Td>
                  <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => handleEdit(transaction.id)} mr={2} />
                  <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => handleDelete(transaction.id)} colorScheme="red" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl">Total Balance: ${calculateBalance()}</Text>
          <Button leftIcon={<FaFileDownload />} onClick={handleExport}>
            Export as JSON
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default Index;
