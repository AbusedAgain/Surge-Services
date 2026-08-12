CreateThread(function()
    if Config.HousingSystem ~= 'b-housing' then
        return
    end

    Config.Tables['properties'] = 'housing'
    Config.Tables['property'] = 'housing'
    Config.Tables['owned_properties'] = 'housing'

    Config.Queries['search:properties'] = 'name LIKE :query'
    Config.Queries['search:property'] = 'name = :query'
    Config.Queries['search:property_name'] = 'name = :query'
    Config.Queries['search:owned_property'] = 'name = :query'
    Config.Queries['search:property_owner'] = 'owner = :query'
    Config.Queries['search:multiple_properties'] = 'name IN (:query)'

    function TransformPropertiesData(houses)
        for i = 1, #houses do
            houses[i] = concat(houses[i], {
                id = houses[i].name,
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
            id = house.name
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

        local coords = json.decode(house.enter_coords)

        return {
            id = house.name,
            name = house.name,
            label = house.name,
            coords = coords,
            owner = house.owner,
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
        
        for i = 1, #houses do
            results[#results + 1] = {
                id = houses[i].name,
                name = ' '
            }
        end

        return results
    end
end)