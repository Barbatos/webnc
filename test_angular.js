function Webnc($scope) {
  $scope.tabs = [
    {name:'Quakenet', notifs: 8, channels: [
        {name:'#frozensand', notifs: 0 },
        {name:'pandy', notifs: 5 },
        {name:'#mqcd', notifs: 0 },
    ]},
    {name:'Freenode', notifs: 5, channels:[
        {name:'#csli', notifs: 3 },
        {name:'_Tyr', notifs: 0 },
        {name:'#test', notifs: 1 },
    ]},
  ];

  $scope.tabs_messages = [
    {
      name: 'Quakenet',
      subject: 'Super sujet de la mort qui tue',
      messages : [
        {date: '13:31', from: 'hoblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint <h1>occaecat</h1> cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: '13:33', from: 'pandy',  content: 'cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: '13:37', from: 'hoblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: '13:37', from: 'pandy',  content: 'officia deserunt mollit anim id est laborum.' },
        {date: '13:37', from: 'pandy',  content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: '13:38', from: 'hoblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: '13:39', from: 'hoblin', content: 'officia deserunt mollit anim id est laborum.' }
      ]
    },
    {
      name: '#frozensand',
      subject: 'frozensand subject !!!',
      messages : [
        {date: '13:31', from: 'hoblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint <h1>occaecat</h1> cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: '13:33', from: 'raider', content: 'cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: '13:37', from: 'hoblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: '13:37', from: 'raider', content: 'officia deserunt mollit anim id est laborum.' },
        {date: '13:37', from: 'raider', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: '13:38', from: 'hoblin', content: 'Lorem ipsum dolor sit amet, consectetupteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        {date: '13:39', from: 'hoblin', content: 'officia deserunt mollit anim id est laborum.' }
      ]
    }
  ];

  $scope.selected_tab = 'Quakenet';

  $scope.selectTab = function( name ){
    $scope.selected_tab = name;
  }
}
