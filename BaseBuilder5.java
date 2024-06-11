package com.example.tree;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import java.io.File; // Import File class
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class BaseBuilder5 {

    // Define a nested class Node to represent each node in the tree
    static class Node {
        String id;
        String name;
        String description;
        List<Node> children;

        // Constructors for Node class
        Node(String id, String name) {
            this.id = id;
            this.name = name;
            this.children = new ArrayList<>();
        }

        Node(String id, String name, String description) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.children = new ArrayList<>();
        }

        // Method to add a child node
        public void addChild(Node child) {
            children.add(child);
        }
    }

    // Instance variables for BaseBuilder5 class
    private Node root; // Root node of the tree

    // Constructor for BaseBuilder5 class
    public BaseBuilder5() {
        root = new Node("root", "root"); // Initialize root node
    }

    // Method to read data from an Excel file and return as a list of string arrays
    public static List<String[]> readExcelFile(String filePath) {
        List<String[]> data = new ArrayList<>();
        try (FileInputStream fis = new FileInputStream(filePath)) {
            Workbook workbook = filePath.endsWith(".xlsx") ? new XSSFWorkbook(fis) : new HSSFWorkbook(fis);
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                List<String> rowData = new ArrayList<>();
                for (Cell cell : row) {
                    cell.setCellType(CellType.STRING);
                    rowData.add(cell.getStringCellValue());
                }
                data.add(rowData.toArray(new String[0]));
            }
            workbook.close();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        return data;
    }

    // Method to build the tree structure from the Excel data
    public void buildTree(List<String[]> data) {
        for (String[] row : data) {
            // Skip rows with insufficient data
            if (row.length < 2) {
                continue;
            }

            // Skip nodes corresponding to lines 1-40
            if (row[0].equals("root") || row[0].equals("SectorId") || row[0].equals("Sector") ||
                row[0].equals("IndustryGroupId") || row[0].equals("IndustryGroup") ||
                row[0].equals("IndustryId") || row[0].equals("Industry") || row[0].equals("SubIndustryId") ||
                row[0].equals("SubIndustry") || row[0].equals("SubIndustryDescription")) {
                continue;
            }

            Node parentNode = root; // Start with the root node as the parent

            // Iterate over each column in the row
            for (int i = 0; i < row.length; i++) {
                String nodeId = row[i];
                String nodeName = (i + 1 < row.length) ? row[i + 1] : ""; // Assuming the next column contains the name

                // Check if a node with the current ID already exists as a child of the parent node
                Node childNode = getChildNode(parentNode, nodeId);

                // If the node doesn't exist, create a new node and add it as a child of the parent node
                if (childNode == null) {
                    childNode = new Node(nodeId, nodeName);
                    parentNode.addChild(childNode);
                }

                // Update the parent node to the newly created or existing child node
                parentNode = childNode;
            }
        }
    }

    // Method to retrieve a child node with the given ID from the parent node's children
    private Node getChildNode(Node parent, String nodeId) {
        for (Node child : parent.children) {
            if (child.id.equals(nodeId)) {
                return child; // Return the child node if found
            }
        }
        return null; // Return null if the child node with the given ID is not found
    }

    // Method to get JSON output of the tree structure
    public String getJsonOutput() {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        return gson.toJson(root); // Convert root node to JSON format
    }

    // Method to read Excel data, build tree, and return JSON output
    public String buildTreeAndGetJson(String filePath) {
        List<String[]> data = readExcelFile(filePath); // Read Excel data
        if (data != null) {
            buildTree(data); // Build tree structure from Excel data
            return getJsonOutput(); // Get JSON output of the tree structure
        }
        return null;
    }

    // Method to write JSON output to a file
    public void writeJsonToFile(String jsonOutput, String outputPath) {
        // Ensure jsonOutput is not null to avoid writing null to the file
        if (jsonOutput == null) {
            System.err.println("No JSON output to write to the file.");
            return;
        }

        // Try-with-resources to ensure FileWriter is closed properly
        try (FileWriter fileWriter = new FileWriter(outputPath)) {
            // Create the file if it doesn't exist
            File file = new File(outputPath);
            if (!file.exists()) {
                file.createNewFile();
            }
            fileWriter.write(jsonOutput);
            System.out.println("JSON output successfully written to " + outputPath);
        } catch (IOException e) {
            System.err.println("Error writing JSON to file: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Main method
    public static void main(String[] args) {
        String filePath = "C:\\Stradegi\\GICS Mapping.xlsx"; // Replace with your Excel file path
        String outputPath = "C:\\Stradegi\\treeOutput2.json"; // Replace with your desired output file path

        BaseBuilder5 builder = new BaseBuilder5();
        String jsonOutput = builder.buildTreeAndGetJson(filePath); // Build tree and get JSON output
        if (jsonOutput != null) {
            builder.writeJsonToFile(jsonOutput, outputPath); // Write JSON output to file
        } else {
            System.out.println("No data found or failed to read the Excel file.");
        }
    }
}
