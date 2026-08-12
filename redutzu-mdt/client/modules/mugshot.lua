local isMugshotActive = false
local renderTargetId = nil
local boardObject = nil
local textObject = nil
local scaleformHandle = nil

local BOARD_MODEL = GetHashKey("prop_police_id_board")
local TEXT_MODEL = GetHashKey("prop_police_id_text")
local ANIM_DICT = "mp_character_creation@lineup@male_a"

function SetupRenderTarget(targetName, modelHash)
    if not IsNamedRendertargetRegistered(targetName) then
        RegisterNamedRendertarget(targetName, 0)
    end
    
    if not IsNamedRendertargetLinked(modelHash) then
        LinkNamedRendertarget(modelHash)
    end
    
    if IsNamedRendertargetRegistered(targetName) then
        return GetNamedRendertargetRenderId(targetName)
    end
    
    return false
end

function LoadScaleformMovie(scaleformName)
    local scaleform = RequestScaleformMovie(scaleformName)
    
    if scaleform ~= 0 then
        while not HasScaleformMovieLoaded(scaleform) do
            Wait(0)
        end
    end
    
    return scaleform
end

function CallScaleformFunction(scaleform, functionName, ...)
    BeginScaleformMovieMethod(scaleform, functionName)
    
    local params = {...}
    
    for _, param in ipairs(params) do
        local paramType = type(param)
        
        if paramType == "string" then
            PushScaleformMovieMethodParameterString(param)
        elseif paramType == "number" then
            if tostring(param):match("%.") then
                PushScaleformMovieFunctionParameterFloat(param)
            else
                PushScaleformMovieFunctionParameterInt(param)
            end
        elseif paramType == "boolean" then
            PushScaleformMovieMethodParameterBool(param)
        end
    end
    
    EndScaleformMovieMethod()
end

function InitializeMugshotSystem()
    scaleformHandle = LoadScaleformMovie("mugshot_board_01")
    renderTargetId = SetupRenderTarget("ID_Text", TEXT_MODEL)
end

function CleanupMugshot()
    local playerPed = PlayerPedId()
    
    ClearPedSecondaryTask(playerPed)
    
    if boardObject then
        DeleteObject(boardObject)
        boardObject = nil
    end
    
    if textObject then
        DeleteObject(textObject)
        textObject = nil
    end
    
    isMugshotActive = false
    renderTargetId = nil
end

-- Initialize system on startup
CreateThread(InitializeMugshotSystem)

RegisterNetEvent("rz-core:client:mugshot", function(playerName)
    local playerPed = PlayerPedId()
    local isInVehicle = IsPedSittingInAnyVehicle(playerPed)
    
    -- Load animation dictionary
    RequestAnimDict(ANIM_DICT)
    while not HasAnimDictLoaded(ANIM_DICT) do
        Wait(100)
    end
    
    if not isMugshotActive and not isInVehicle then
        InitializeMugshotSystem()
        
        -- Render thread for mugshot display
        CreateThread(function()
            while renderTargetId do
                SetTextRenderId(renderTargetId)
                Set_2dLayer(4)
                SetScriptGfxDrawBehindPausemenu(true)
                
                DrawScaleformMovie(scaleformHandle, 0.405, 0.37, 0.81, 0.74, 255, 255, 255, 255, 0)
                
                SetScriptGfxDrawBehindPausemenu(false)
                
                local defaultRenderId = GetDefaultScriptRendertargetRenderId()
                SetTextRenderId(defaultRenderId)
                
                Wait(0)
            end
        end)
        
        -- Setup mugshot data
        local day, month, year = GetLocalTime()
        local dateString = string.format("%s/%s/%s", year, month, day)
        
        CallScaleformFunction(
            scaleformHandle,
            "SET_BOARD",
            Config.Mugshot.Title,
            playerName,
            dateString,
            Config.Mugshot.Label,
            0,
            Config.Mugshot.Level,
            116
        )
        
        Wait(500)
        
        -- Load and create objects
        RequestModel(BOARD_MODEL)
        RequestModel(TEXT_MODEL)
        
        while not HasModelLoaded(BOARD_MODEL) or not HasModelLoaded(TEXT_MODEL) do
            Wait(1)
        end
        
        local playerCoords = GetEntityCoords(playerPed)
        boardObject = CreateObject(BOARD_MODEL, playerCoords.x, playerCoords.y, playerCoords.z, true, true, false)
        textObject = CreateObject(TEXT_MODEL, playerCoords.x, playerCoords.y, playerCoords.z, true, true, false)
        
        -- Attach text to board
        AttachEntityToEntity(
            textObject,
            boardObject,
            -1,
            4103, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            false, false, false, false, 2, true
        )
        
        SetModelAsNoLongerNeeded(BOARD_MODEL)
        SetModelAsNoLongerNeeded(TEXT_MODEL)
        
        -- Setup player for mugshot
        local playerId = PlayerId()
        local unarmedHash = GetHashKey("weapon_unarmed")
        local rightHandBone = GetPedBoneIndex(playerPed, 28422)
        
        ClearPedWetness(playerPed)
        ClearPedBloodDamage(playerPed)
        ClearPlayerWantedLevel(playerId)
        SetCurrentPedWeapon(playerPed, unarmedHash, true)
        
        -- Attach board to player and play animation
        AttachEntityToEntity(
            boardObject,
            playerPed,
            rightHandBone,
            0.0, 0.0, 0.0,
            0.0, 0.0, 0.0,
            0, 0, 0, 0, 2, 1
        )
        
        TaskPlayAnim(
            playerPed,
            ANIM_DICT,
            "loop_raised",
            8.0, 8.0, -1, 49, 0.0,
            false, false, false
        )
        
        isMugshotActive = true
    else
        CleanupMugshot()
    end
end)