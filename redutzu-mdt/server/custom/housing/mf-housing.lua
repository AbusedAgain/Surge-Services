CreateThread(function()
    if Config.HousingSystem ~= 'mf-housing' then
        return
    end

    Config.Tables['properties'] = 'housing_v3'
    Config.Tables['property'] = 'housing_v3'
    Config.Tables['owned_properties'] = 'housing_v3'

    Config.Queries['search:properties'] = 'JSON_VALUE(houseInfo, \'$.addressLabel\') LIKE :query'
    Config.Queries['search:property'] = 'houseId = :query'
    Config.Queries['search:property_name'] = 'JSON_VALUE(houseInfo, \'$.addressLabel\') = :query'
    Config.Queries['search:owned_property'] = 'JSON_VALUE(houseInfo, \'$.addressLabel\') = :query'
    Config.Queries['search:property_owner'] = 'JSON_VALUE(ownerInfo, \'$.identifier\') = :query'

    function TransformPropertiesData(houses)
        for i = 1, #houses do
            local house = json.decode(houses[i].houseInfo)

            houses[i] = concat(houses[i], {
                id = houses[i].houseId,
                label = house.addressLabel
            })
        end
    end

    function GetWarrantHouse(name)
        local house = Database.fetchSingle({
            table = Config.Tables['properties'],
            condition = Config.Queries['search:property_name'],
            parameters = { query = name }
        })

        local data = json.decode(house.houseInfo)

        return {
            label = data.addressLabel,
            id = house.houseId
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
            parameters = { query = house.houseId }
        })

        local data = json.decode(house.houseInfo)
        local locations = json.decode(house.locations)[1]
        local owner = json.decode(house.ownerInfo)

        return {
            id = house.houseId,
            name = data.addressLabel,
            label = data.addressLabel,
            coords = json.encode(locations.position),
            owner = owner.identifier,
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
            local house = json.decode(houses[i].houseInfo)

            results[#results + 1] = {
                id = houses[i].houseId,
                name = house.streetName
            }
        end

        return results
    end
end)