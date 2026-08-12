CreateThread(function()
    if Config.HousingSystem ~= 'bcs_housing' then
        return
    end

    Config.Tables['properties'] = 'house'
    Config.Tables['property'] = 'house'
    Config.Tables['owned_properties'] = 'house_owned'

    Config.Queries['search:properties'] = 'name LIKE :query'
    Config.Queries['search:property'] = 'identifier = :query'
    Config.Queries['search:property_name'] = 'identifier = :query'
    Config.Queries['search:owned_property'] = 'identifier = :query'
    Config.Queries['search:property_owner'] = 'owner = :query'
    Config.Queries['search:multiple_properties'] = 'identifier IN (:query)'

    function TransformPropertiesData(houses)
        for i = 1, #houses do
            houses[i] = concat(houses[i], {
                id = houses[i].identifier,
                name = houses[i].identifier,
                label = houses[i].name
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
            label = house.name,
            id = house.identifier
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
            parameters = { query = house.identifier }
        })

        local owned = Database.fetchSingle({
            table = Config.Tables['owned_properties'],
            condition = Config.Queries['search:owned_property'],
            parameters = { query = house.identifier }
        })

        local object = json.decode(house.data)

        return {
            id = house.identifier,
            name = house.name,
            label = house.name,
            coords = object.entry,
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
            array[i] = houses[i].identifier
        end

        local names = table.concat(array, ', ')
        local houses = Database.fetchAll({
            table = Config.Tables['properties'],
            condition = Config.Queries['search:multiple_properties'],
            parameters = { query = names }
        })

        for i = 1, #houses do
            results[#results + 1] = {
                id = houses[i].identifier,
                name = houses[i].name
            }
        end

        return results
    end
end)