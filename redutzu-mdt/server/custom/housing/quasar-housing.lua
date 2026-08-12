CreateThread(function()
    if Config.HousingSystem ~= 'quasar-housing' then
        return
    end

    Config.Tables['properties'] = 'houselocations'
    Config.Tables['property'] = 'houselocations'
    Config.Tables['owned_properties'] = 'player_houses'

    Config.Queries['search:properties'] = 'label LIKE :query'
    Config.Queries['search:property'] = 'name LIKE :query'
    Config.Queries['search:property_name'] = 'name = :query'
    Config.Queries['search:owned_property'] = 'house = :query'
    Config.Queries['search:property_owner'] = 'identifier = :query'
    Config.Queries['search:multiple_properties'] = 'name IN (:query)'

    function TransformPropertiesData(houses)
        for i = 1, #houses do
            houses[i] = concat(houses[i], {
                id = houses[i].name
            })
        end
    end

    function GetWarrantHouse(name)
        local house = Database.fetchSingle({
            table = Config.Tables['properties'],
            condition = Config.Queries['search:property_name'],
            parameters = { query = name }
        })

        return {
            label = house.label,
            id = house.name
        }
    end

    function GetHouseData(id)
        local house = Database.fetchSingle({
            table = Config.Tables['properties'],
            condition = Config.Queries['search:property'],
            parameters = { query = '%' .. id .. '%' }
        })

        local warrants = Database.fetchAll({
            table = Config.Tables['warrants'],
            condition = Config.Queries['search:property_warrant'],
            parameters = { query = house.name }
        })
    
        local owned = Database.fetchSingle({
            table = Config.Tables['owned_properties'],
            condition = Config.Queries['search:owned_property'],
            parameters = { query = house.name }
        })
    
        local coords = json.decode(house.coords)
    
        return {
            id = house.id,
            name = house.name,
            label = house.label,
            coords = coords.enter,
            owner = owned and owned.identifier or nil,
            warrants = warrants
        }
    end

    function GetCitizenHouses(identifier)
        local results = {}
        local owned_houses = Database.fetchAll({
            table = Config.Tables['owned_properties'],
            condition = Config.Queries['search:property_owner'],
            parameters = { query = identifier }
        })
        
        local array = {}

        for i = 1, #owned_houses do        
            array[i] = owned_houses[i].house
        end

        local names = table.concat(array, ', ')
        local houses = Database.fetchAll({
            table = Config.Tables['properties'],
            condition = Config.Queries['search:multiple_properties'],
            parameters = { query = names }
        })
    
        for i = 1, #houses do
            results[#results + 1] = {
                id = houses[i].name,
                name = ' '
            }
        end

        return results
    end
end)