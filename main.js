if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

const CloudSave = {};

CloudSave.buildMenuHTML = function () {
  let HTML = '';
  HTML += '<div class="listing">';

  const value = CloudSave.data['ownerSecretUUID'] || '';
  // InputBox: (id, width, value, onChange) => String
  HTML += CCSE.MenuHelper.InputBox(
    'ownerSecretUUID',
    255,
    value,
    "CloudSave.setData('ownerSecretUUID', l('ownerSecretUUID').value)"
  );

  HTML += '<br>';

  // ActionButton: (action, text) => String
  HTML += CCSE.MenuHelper.ActionButton('CloudSave.loadSave();', 'Load Cloud Save');

  // ActionButton: (action, text) => String
  HTML += CCSE.MenuHelper.ActionButton('CloudSave.storeSave();', 'Cloud Save');

  HTML += '</div>';
  return HTML;
}

CloudSave.init = function () {
  CloudSave.data = {};
  Game.customOptionsMenu.push(function(){
    CCSE.AppendCollapsibleOptionsMenu('Cloud Save', CloudSave.buildMenuHTML());
  });
}

CloudSave.save = function () {
  return JSON.stringify(CloudSave.data);
}

CloudSave.load = function (savedData) {
  const dataObject = JSON.parse(savedData);

  CloudSave.data = dataObject;
}

CloudSave.setData = function(key, value) {
  CloudSave.data[key] = value;
}

CloudSave.storeSave = async function () {
  const URL = "https://kpyp5uqpnifj5pte5ladbo27zi0zifxo.lambda-url.sa-east-1.on.aws/";

  const response = await fetch(URL, {
    method: 'PUT',
    body: JSON.stringify({owner_uuid: CloudSave.data['ownerSecretUUID'], save: Game.WriteSave(1)}),
    headers: {'Content-Type': 'application/json'}
  });

  const body = await response.text();

  if(body === 'ok') {
    Game.Notify('Cloud Saved Successfuly.','','',1,1)
  } else {
    Game.Notify('Cloud Save was NOT Sucessfull', body,'',1,1)
  }

  return response;
}

CloudSave.loadSave = async function () {
  const URL = "https://emncx62pn4bucvnmvob6wb35ui0neuae.lambda-url.sa-east-1.on.aws/";

  const response = await fetch(URL, {
    body: JSON.stringify({owner_uuid: CloudSave.data['ownerSecretUUID']}),
    headers: {'Content-Type': 'application/json'}
  });
  const body = await response.text();

  if (response.status == 200) {
    Game.LoadSave(body);
  } else {
    Game.Notify('Cloud Load was NOT Sucessfull', body,'',1,1)
  }
}

if (typeof CCSE === 'undefined' || !CCSE.isLoaded) {
  CCSE = {postLoadHooks: [() => Game.registerMod('Cloud Save', CloudSave)]};
} else {
  Game.registerMod('Cloud Save', CloudSave);
}

