local propertiesData = nil
local isHousingEnabled = Config.HousingSystem == "default" or Config.HousingSystem == "none"

-- Load properties data on resource start
CreateThread(function()
    if not isHousingEnabled then
        return
    end

    local propertiesFile = LoadResourceFile("esx_property", "properties.json")
    propertiesData = json.decode(propertiesFile)
end)

-- Transform properties data (placeholder function)
function TransformPropertiesData(data)
    return data
end

-- Search properties by query
function alternative_properties(searchData, cb)
    local results = {}
    
    -- Clean and normalize search query
    searchData.query = string.sub(searchData.query, 2, -2)
    searchData.query = string.lower(searchData.query)
    searchData.query = RemoveStringExtraSpaces(searchData.query)
    
    -- Search through properties
    for index, property in ipairs(propertiesData) do
        local propertyName = string.lower(property.Name)
        
        -- If no query or query matches property name
        if #searchData.query == 0 or string.find(propertyName, searchData.query) then
            table.insert(results, {
                label = property.Name,
                name = property.Name,
                id = index
            })
        end
    end
    
    cb(results)
end

-- Get house data for warrant system
function GetWarrantHouse(houseName)
    local result = {}
    
    if Config.HousingSystem == "none" then
        return result
    end
    
    for index, property in ipairs(propertiesData) do
        if property.Name == houseName then
            result = {
                label = property.Name,
                id = index
            }
            break
        end
    end
    
    return result
end

-- Get detailed house data including warrants
function GetHouseData(houseId)
    local houseData = {}
    
    if Config.HousingSystem == "none" then
        return houseData
    end
    
    for index, property in ipairs(propertiesData) do
        if tonumber(index) == tonumber(houseId) then
            -- Fetch warrants for this property
            local warrants = Database.fetchAll({
                table = Config.Tables.warrants,
                condition = Config.Queries["search:property_warrant"],
                parameters = { query = property.Name }
            })
            
            houseData = {
                id = index,
                name = property.Name,
                label = property.Name,
                coords = property.Entrance,
                owner = property.Owned and property.Owner or nil,
                warrants = warrants
            }
            break
        end
    end
    
    return houseData
end

-- Get all houses owned by a citizen
function GetCitizenHouses(ownerIdentifier)
    local houses = {}
    
    if Config.HousingSystem == "none" then
        return houses
    end
    
    for index, property in ipairs(propertiesData) do
        if property.Owner == ownerIdentifier then
            table.insert(houses, {
                id = index,
                name = property.Name
            })
        end
    end
    
    return houses
end

-- Callback: Get house data
RegisterCallback("GetHouseData", function(source, cb, houseId)
    local houseData = GetHouseData(houseId)
    cb(houseData)
end)

-- Callback: Get warrant house information
RegisterCallback("GetWarrantHouse", function(source, cb, houseName)
    local houseInfo = GetWarrantHouse(houseName)
    cb(houseInfo)
end)