-- Bounded container traversal; no account-field values are requested or recorded.
property helperDeadline : missing value
property queryCount : 0
property nodesVisited : 0
property requestedPane : ""

on checkBudget()
  if (current date) ≥ helperDeadline then error "BLIP_SETTINGS_HELPER_TIMEOUT"
  set queryCount to queryCount + 1
  if queryCount > 240 then error "BLIP_SETTINGS_SCOPE_LIMIT"
end checkBudget

on boundedQuery(operation, targetElement)
  my checkBudget()
  try
    with timeout of 1 second
      tell application "System Events"
        if operation is "roots" then
          set children to UI elements of process "Blip"
          if (count children) > 8 then error "BLIP_SETTINGS_SCOPE_LIMIT"
          return children
        else if operation is "children" then
          set children to UI elements of targetElement
          if (count children) > 16 then error "BLIP_SETTINGS_SCOPE_LIMIT"
          return children
        else if operation is "role" then
          return role of targetElement
        else if operation is "gear_button" then
          -- Filter directly for the observed Settings control.
          if exists (first button of targetElement whose description is "Settings") then
            return first button of targetElement whose description is "Settings"
          end if
          return missing value
        else if operation is "enabled" then
          return enabled of targetElement
        else if operation is "settings_window" then
          return exists window "Blip Settings" of process "Blip"
        else if operation is "menu_item" then
          if exists menu item "Settings…" of targetElement then return menu item "Settings…" of targetElement
          return missing value
        else if operation is "frontmost" then
          set frontmost of process "Blip" to true
          return true
        else if operation is "click" then
          click targetElement
          return true
        else if operation is "select_pane" then
          tell window "Blip Settings" of process "Blip"
            if exists button requestedPane of toolbar 1 then
              click button requestedPane of toolbar 1
              return true
            end if
          end tell
          return false
        end if
      end tell
    end timeout
  on error errorText number errorNumber
    if errorNumber is -1712 then error "BLIP_SETTINGS_QUERY_TIMEOUT"
    -- A disappearing popover/menu is a transient absence, not a broader search.
    if errorNumber is -1728 then return missing value
    error errorText number errorNumber
  end try
  error "BLIP_SETTINGS_SCOPE_LIMIT"
end boundedQuery

on visitNode()
  set nodesVisited to nodesVisited + 1
  if nodesVisited > 48 then error "BLIP_SETTINGS_SCOPE_LIMIT"
end visitNode

on findGearInNode(targetElement, depth)
  if depth > 4 then return missing value
  my visitNode()
  set elementRole to my boundedQuery("role", targetElement)
  if elementRole is in {"AXPopover", "AXWindow", "AXGroup"} then
    set gearControl to my boundedQuery("gear_button", targetElement)
    if gearControl is not missing value then return {gearControl:gearControl, gearScope:targetElement}
    if depth ≥ 4 then return missing value
    set children to my boundedQuery("children", targetElement)
    if children is not missing value then
      repeat with childElement in children
        set foundGear to my findGearInNode(contents of childElement, depth + 1)
        if foundGear is not missing value then return foundGear
      end repeat
    end if
  end if
  return missing value
end findGearInNode

on findSettingsGear()
  set nodesVisited to 0
  set roots to my boundedQuery("roots", missing value)
  if roots is missing value then return missing value
  repeat with rootElement in roots
    set foundGear to my findGearInNode(contents of rootElement, 0)
    if foundGear is not missing value then return foundGear
  end repeat
  return missing value
end findSettingsGear

on findMenuInNode(targetElement, depth, allowGearChildren)
  if depth > 4 then return missing value
  my visitNode()
  set elementRole to my boundedQuery("role", targetElement)
  if elementRole is "AXMenu" then
    -- Target only the known Settings item; never read other menu-item names.
    set settingsItem to my boundedQuery("menu_item", targetElement)
    if settingsItem is not missing value then
      if my boundedQuery("enabled", settingsItem) is true then return settingsItem
    end if
  else if depth < 4 and (elementRole is in {"AXPopover", "AXWindow", "AXGroup"} or (depth is 0 and allowGearChildren)) then
    set children to my boundedQuery("children", targetElement)
    if children is not missing value then
      repeat with childElement in children
        set settingsItem to my findMenuInNode(contents of childElement, depth + 1, false)
        if settingsItem is not missing value then return settingsItem
      end repeat
    end if
  end if
  return missing value
end findMenuInNode

on findSettingsMenu(gearInfo)
  set nodesVisited to 0
  set settingsItem to my findMenuInNode(gearControl of gearInfo, 0, true)
  if settingsItem is not missing value then return settingsItem
  -- CUA observed the menu inside the same popover container as the gear.
  return my findMenuInNode(gearScope of gearInfo, 0, false)
end findSettingsMenu

on run arguments
  if (count arguments) is not 1 then error "BLIP_UNKNOWN_SETTINGS_PANE"
  set requestedPane to item 1 of arguments
  if requestedPane is not in {"General", "Profile", "Devices", "Help"} then error "BLIP_UNKNOWN_SETTINGS_PANE"
  set helperDeadline to (current date) + 10
  set queryCount to 0
  set nodesVisited to 0

  try
    my checkBudget()
    with timeout of 1 second
      tell application id "net.blip.macos" to activate
    end timeout
    my boundedQuery("frontmost", missing value)

    if my boundedQuery("settings_window", missing value) is not true then
      set gearInfo to my findSettingsGear()
      if gearInfo is missing value then
        my checkBudget()
        with timeout of 1 second
          tell application id "net.blip.macos" to reopen
        end timeout
        set stageDeadline to (current date) + 3
        repeat while gearInfo is missing value and (current date) < stageDeadline
          set gearInfo to my findSettingsGear()
          if gearInfo is missing value then delay 0.2
        end repeat
      end if
      if gearInfo is missing value then error "BLIP_SETTINGS_BUTTON_NOT_FOUND"
      my boundedQuery("click", gearControl of gearInfo)

      set settingsItem to missing value
      set stageDeadline to (current date) + 3
      repeat while settingsItem is missing value and (current date) < stageDeadline
        set settingsItem to my findSettingsMenu(gearInfo)
        if settingsItem is missing value then delay 0.2
      end repeat
      if settingsItem is missing value then error "BLIP_SETTINGS_MENU_NOT_FOUND"
      my boundedQuery("click", settingsItem)
    end if

    set stageDeadline to (current date) + 3
    repeat while (current date) < stageDeadline
      if my boundedQuery("settings_window", missing value) is true then
        if my boundedQuery("select_pane", missing value) is true then return requestedPane
      end if
      delay 0.2
    end repeat
  on error errorText number errorNumber
    if errorNumber is -1712 then error "BLIP_SETTINGS_QUERY_TIMEOUT"
    error errorText number errorNumber
  end try
  error "BLIP_SETTINGS_WINDOW_NOT_FOUND"
end run
