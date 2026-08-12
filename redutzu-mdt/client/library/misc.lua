-- Merge two tables (concatenate key-value pairs)
function concat(targetTable, sourceTable)
    for key, value in pairs(sourceTable) do
        targetTable[key] = value
    end
    return targetTable
end

-- Remove extra spaces from string
function RemoveStringExtraSpaces(str)
    return string.gsub(str, "%s+", " ")
end

-- Get nested value from object using dot notation path
function getValueAtPath(obj, path)
    local pathSegments = {}
    
    -- Split path by dots
    for segment in string.gmatch(path, "[^%.]+") do
        table.insert(pathSegments, segment)
    end
    
    -- Traverse the object using path segments
    local currentValue = obj
    
    for _, segment in ipairs(pathSegments) do
        if not currentValue then
            return nil
        end
        
        local valueType = type(currentValue)
        
        if valueType == "table" then
            -- Try to access by key
            if currentValue[segment] ~= nil then
                currentValue = currentValue[segment]
            else
                -- Try to access by numeric index
                local numericIndex = tonumber(segment)
                if numericIndex then
                    -- Validate array bounds
                    if numericIndex >= 1 and numericIndex <= #currentValue then
                        currentValue = currentValue[numericIndex]
                    else
                        return nil
                    end
                else
                    return nil
                end
            end
        else
            return nil
        end
    end
    
    return currentValue
end