-- Apply a function to each element in a table and concatenate the results
function map(table, func)
    local result = ""
    for key, value in pairs(table) do
        result = result .. func(value)
    end
    return result
end

-- Merge two tables (copy all key-value pairs from second table into first table)
function concat(table1, table2)
    for key, value in pairs(table2) do
        table1[key] = value
    end
    return table1
end

-- Append all elements from second table to first table
function mergeTables(table1, table2)
    for i = 1, #table2 do
        table.insert(table1, table2[i])
    end
    return table1
end

-- Convert an array to a set (table with values as keys and true as values)
function arrayToSet(array)
    local set = {}
    for i = 1, #array do
        set[array[i]] = true
    end
    return set
end

-- Get all keys from a table as an array
function keys(table)
    local keyArray = {}
    for key, _ in pairs(table) do
        keyArray[#keyArray + 1] = key
    end
    return keyArray
end

-- Replace all template placeholders in a string with values from a table
function replace_all(text, replacements)
    if not replacements then
        replacements = {}
    end
    
    local replacementKeys = keys(replacements)
    
    for i = 1, #replacementKeys do
        local key = replacementKeys[i]
        local value = replacements[key]
        text = text:gsub("%{{" .. key .. "}}", value)
    end
    
    return text
end

-- Remove extra spaces from a string
function RemoveStringExtraSpaces(text)
    return text:gsub("%s+", " ")
end

-- Create a formatted string from an array of tables using a template
function string_map(array, options)
    local result = ""
    local config = {
        separator = options.separator or ", ",
        template = options.template or "{{name}}",
        count = options.count or false
    }
    
    for i = 1, #array do
        local prefix = config.count and (i .. ". ") or ""
        result = result .. prefix .. replace_all(config.template, array[i])
        
        if i ~= #array then
            result = result .. config.separator
        end
    end
    
    return result
end

-- Check if a string is empty or nil
function isStrEmpty(str)
    return str == nil or str == ""
end

-- Filter a table based on a predicate function
function filter(table, predicate)
    local filtered = {}
    
    for key, value in pairs(table) do
        if predicate(value, key, table) then
            filtered[key] = value
        end
    end
    
    return filtered
end