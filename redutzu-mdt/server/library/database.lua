Database = {}

-- Helper function to format SQL queries based on database resource
local function FormatQuery(query)
    local oxmysqlState = GetResourceState("oxmysql")
    local mysqlAsyncState = GetResourceState("mysql-async")
    
    query = query or " "
    
    if oxmysqlState == "started" then
        return string.gsub(query, "@", ":")
    elseif mysqlAsyncState == "started" then
        return string.gsub(query, ":", "@")
    end
    
    return query
end

-- Fetch multiple rows from database
function Database.fetchAll(options)
    local tableName = options.table
    local columns = options.columns or "*"
    local sort = options.sort or false
    local condition = options.condition or false
    local parameters = options.parameters or {}
    local limit = tonumber(options.limit) or 0
    
    local query = string.format("SELECT %s FROM %s", columns, tableName)
    
    if condition then
        query = query .. " WHERE " .. condition
    end
    
    if sort then
        query = query .. string.format(" ORDER BY %s %s", sort.column, sort.type)
    end
    
    if limit > 0 then
        query = query .. " LIMIT " .. limit
    end
    
    query = FormatQuery(query)
    
    return MySQL.Sync.fetchAll(query, parameters)
end

-- Fetch single row from database
function Database.fetchSingle(options)
    options.limit = 1
    local result = Database.fetchAll(options)
    return result[1]
end

-- Execute raw SQL query
function Database.execute(options)
    local query = FormatQuery(options.query)
    local values = options.values or {}
    
    return MySQL.Sync.execute(query, values)
end

-- Insert new record into database
function Database.insert(options)
    local tableName = options.table
    local values = options.values or {}
    
    local columns = ""
    local placeholders = ""
    
    for column, _ in pairs(values) do
        columns = columns .. column .. ", "
        placeholders = placeholders .. ":" .. column .. ", "
    end
    
    -- Remove trailing commas
    columns = string.sub(columns, 1, -3)
    placeholders = string.sub(placeholders, 1, -3)
    
    local query = string.format("INSERT INTO %s (%s) VALUES (%s)", tableName, columns, placeholders)
    query = FormatQuery(query)
    
    return MySQL.Sync.insert(query, values)
end

-- Count records in table
function Database.count(options)
    local tableName = options.table
    local query = string.format("SELECT COUNT(*) AS items FROM %s", tableName)
    
    local result = MySQL.Sync.fetchSingle(query, {})
    return result.items
end