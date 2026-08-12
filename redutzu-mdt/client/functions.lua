local tabletObject = nil

function RequestAnim(animDict, callback)
    if not HasAnimDictLoaded(animDict) then
        RequestAnimDict(animDict)
        while not HasAnimDictLoaded(animDict) do
            Wait(10)
        end
    end
    
    if callback then
        return callback(animDict)
    end
end

function LoadPropDict(modelName)
    local modelHash = GetHashKey(modelName)
    
    while not HasModelLoaded(modelHash) do
        RequestModel(modelHash)
        Wait(10)
    end
end

function GetStreetLabel(coords)
    local zoneName = GetNameOfZone(coords.x, coords.y, coords.z)
    local zoneLabel = GetLabelText(zoneName)
    local streetHash = GetStreetNameAtCoord(coords.x, coords.y, coords.z)
    local streetName = GetStreetNameFromHashKey(streetHash)
    
    return string.format("%s, %s", zoneLabel, streetName)
end

function ToggleAnimation(enable)
    local playerPed = PlayerPedId()
    
    if enable then
        -- Load animation and prop
        RequestAnim(Config.Animation.Anim)
        
        if not tabletObject then
            LoadPropDict(Config.Animation.Prop)
            
            local propHash = GetHashKey(Config.Animation.Prop)
            local playerCoords = GetEntityCoords(playerPed, false)
            
            tabletObject = CreateObject(propHash, playerCoords.x, playerCoords.y, playerCoords.z, true, true, false)
            
            AttachEntityToEntity(
                tabletObject,
                playerPed,
                GetPedBoneIndex(playerPed, Config.Animation.BoneIndex),
                0.0, 0.0, 0.03,  -- Position offset
                0.0, 0.0, 0.0,   -- Rotation offset
                true, true, false, false, 0, true
            )
        end
        
        -- Play animation if not already playing
        if not IsEntityPlayingAnim(playerPed, Config.Animation.Anim, "base", 3) then
            TaskPlayAnim(
                playerPed,
                Config.Animation.Anim,
                "base",
                8.0, 1.0, -1, 49, 1.0, false, false, false
            )
        end
    else
        -- Clean up animation and prop
        if tabletObject then
            DeleteEntity(tabletObject)
            DetachEntity(tabletObject)
            tabletObject = nil
        end
        
        ClearPedTasks(playerPed)
    end
end

AddEventHandler("onResourceStop", function(resourceName)
    if GetCurrentResourceName() ~= resourceName then
        return
    end
    
    ToggleAnimation(false)
end)