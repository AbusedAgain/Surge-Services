CreateThread(function()
    if Config.HousingSystem ~= 'custom' then
        return
    end

    Config.Tables['properties'] = 'table_name'
    Config.Tables['property'] = 'table_name'
    Config.Tables['owned_properties'] = 'table_name'

    Config.Queries['search:properties'] = 'column LIKE :query'
    Config.Queries['search:property'] = 'column = :query'
    Config.Queries['search:property_name'] = 'column = :query'
    Config.Queries['search:owned_property'] = 'column = :query'
    Config.Queries['search:property_owner'] = 'column = :query'

    -- Transforms the data from the database to a readable format
    ---@param houses table # [{ your_house_data }, ...]
    function TransformPropertiesData(houses)
        for i = 1, #houses do

        end
    end

    -- Retursn the house data for the warrant
    ---@param name string # The name of the house
    ---@return table # { label: string, id: string }
    function GetWarrantHouse(name)
        return {
            label = ' ',
            id = ' '
        }
    end

    -- Returns the house data
    ---@param id string # The id of the house
    ---@return table # { id: string, name: string, label: string, coords: { x: number, y: number, z: number }, owner: string, warrants: array }
    function GetHouseData(id)

        return {
            id = ' ',
            name = ' ',
            label = ' ',
            coords = {
                x = 0.0,
                y = 0.0,
                z = 0.0
            },
            owner = ' ',
            warrants = {}
        }
    end

    -- Returns the houses owned by a player
    ---@param identifier string # The identifier of the player
    ---@return table # [{ id: string, name: string }, ...]
    function GetCitizenHouses(identifier)
        local results = {}
        local houses = {}

        for i = 1, #houses do
            results[#results + 1] = {
                id = ' ',
                name = ' '
            }
        end

        return results
    end
end)