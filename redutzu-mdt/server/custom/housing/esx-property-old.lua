CreateThread(function()
    if Config.HousingSystem ~= 'esx-property-old' then
        return
    end

    Config.Tables['properties'] = 'properties'
    Config.Tables['property'] = 'properties'
    Config.Tables['owned_properties'] = 'owned_properties'

    Config.Queries['search:properties'] = 'label LIKE :query'
    Config.Queries['search:property'] = 'id = :query'
    Config.Queries['search:property_name'] = 'name = :query'
    Config.Queries['search:owned_property'] = 'name = :query'
    Config.Queries['search:property_owner'] = 'owner = :query'
    Config.Queries['search:multiple_properties'] = 'name IN (:query)'

    function TransformPropertiesData(houses)
        return houses
    end

    function GetWarrantHouse(name)
        local house = Database.fetchSingle({
            table = Config.Tables['properties'],
            condition = Config.Queries['search:property_name'],
            parameters = { query = name }
        })

        return {
            label = house.label,
            id = house.id
        }
    end

    function GetHouseData(id)
        local house = Database.fetchSingle({
            table = Config.Tables['properties'],
            condition = Config.Queries['search:property'],
            parameters = { query = id  }
        })

        local warrants = Database.fetchAll({
            table = Config.Tables['warrants'],
            condition = Config.Queries['search:property_warrant'],
            parameters = { query = house.name }
        })

        return {
            id = house.id,
            name = house.name,
            label = house.label,
            coords = house.entering,
            owner = owned and owned.owner or nil,
            warrants = warrants
        }
    end

    function GetCitizenHouses(identifier)
        local results = {}
        local houses = Database.fetchAll({
            table = Config.Tables['owned_properties'],
            condition = Config.Queries['search:property_owner'],
            parameters = { query = identifier }
        })

        local array = {}

        for i = 1, #houses do        
            array[i] = houses[i].house
        end

        local names = table.concat(array, ', ')
        local houses = Database.fetchAll({
            table = Config.Tables['properties'],
            condition = Config.Queries['search:multiple_properties'],
            parameters = { query = names }
        })

        for i = 1, #houses do
            results[#results + 1] = houses[i]
        end

        return results
    end
end)