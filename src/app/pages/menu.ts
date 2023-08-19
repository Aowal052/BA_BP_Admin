export default function (values: any) {
  return [
    {
      title: values['dashboard']['title'],
      children: [
        {
          title: values['dashboard']['analysis'],
          link: '/pages/dashboard/analysis',
        },
        {
          title: values['dashboard']['monitor'],
          link: '/pages/dashboard/monitor',
        },
        {
          title: values['dashboard']['workspace'],
          link: '/pages/dashboard/workspace',
        },
      ],
      link: '/pages/dashboard',
      menuIcon: 'icon icon-console',
    },
    {
      title: values['basicdata']['title'],
      menuIcon: 'icon icon-modify',
      children: [
        {
              title: values['basicdata']['quantityWisePriecConfig'],
              link: '/pages/basicdata/quantity-wise-product-price'
        },
        
        { 
          title: values['basicdata']['productPriceConfiguration'],
          link: '/pages/settings/configure-product-price'
        },
      ]
    },
    {
      title: values['inventory']['title'],
      menuIcon: 'icon icon-modify',
      children: [
        {
          
              title: values.inventory.catgory['listCategory'],
              link: '/pages/inventory/list-category'
        },
        {
          title: values.inventory.sub_catgory['subCategory'],
          link: '/pages/inventory/sub-category'
        },
        {
              title: values.inventory.product['listProduct'],
              link: '/pages/inventory/list-product'
        },
        {
              title: values.inventory.customer['customer'],
              link: '/pages/inventory/customer'
        },
        {
          title: values.inventory.subCustomer['sub_customer'],
          link: '/pages/inventory/sub-customer'
        },
      ]
    },
    {
      title: values['operation']['title'],
      menuIcon: 'icon icon-modify',
      children: [
        {
          
              title: values.operation.sales['title'],
              link: '/pages/operation/create-sales'
        },
        // {
        //       title: values.operation.purchase['title'],
        //       link: '/pages/inventory/list-product'
        // }
      ]
    },
    // {
    //   title: values['form']['title'],
    //   children: [
    //     {
    //       title: values['form']['basicForm'],
    //       children: [
    //         {
    //           title: values['form']['basicForm'],
    //           link: '/pages/form/basic-form',
    //         },
    //         {
    //           title: values['form']['formLayout'],
    //           link: '/pages/form/form-layout',
    //         },
    //         {
    //           title: values['form']['advancedForm'],
    //           link: '/pages/form/advanced-form',
    //         },
    //         {
    //           title: values['form']['dynamicForm'],
    //           link: '/pages/form/dynamic-form',
    //         },
    //       ]
    //     },
    //     {
    //       title: values['form']['formLayout'],
    //       link: '/pages/form/form-layout',
    //     },
    //     {
    //       title: values['form']['advancedForm'],
    //       link: '/pages/form/advanced-form',
    //     },
    //     {
    //       title: values['form']['dynamicForm'],
    //       link: '/pages/form/dynamic-form',
    //     },
    //   ],
    //   link: '/pages/form',
    //   menuIcon: 'icon icon-modify',
    // },
    // {
    //   title: values['list']['title'],
    //   children: [
    //     { title: values['list']['basicList'], link: '/pages/list/basic' },
    //     { title: values['list']['cardList'], link: '/pages/list/card' },
    //     {
    //       title: values['list']['editableList'],
    //       link: '/pages/list/editable',
    //     },
    //     { title: values['list']['advanceList'], link: '/pages/list/advance' },
    //     { title: values['list']['treeList'], link: '/pages/list/tree' },
    //   ],
    //   link: '/pages/list',
    //   menuIcon: 'icon icon-table',
    // },
    // {
    //   title: values['abnormal']['title'],
    //   children: [
    //     { title: '403', link: '/pages/abnormal/abnormal403' },
    //     { title: '404', link: '/pages/abnormal/abnormal404' },
    //     { title: '500', link: '/pages/abnormal/abnormal500' },
    //   ],
    //   link: '/pages/abnormal',
    //   menuIcon: 'icon icon-unload',
    // },
    {
      title: values['user']['title'],
      children: [
        { title: values['user']['addusers'], link: '/pages/user/add-user' },
        { title: values['user']['center'], link: '/pages/user/center' },
        { title: values['user']['settings'], link: '/pages/user/settings' },
      ],
      link: '/pages/user',
      menuIcon: 'icon icon-mine',
    },
    {
      title: values['settings']['title'],
      children: [
        { title: values['settings']['commision'], link: '/pages/settings/create-commission' },
        { title: values['settings']['offer'], link: '/pages/settings/create-offer' },
        { title: values['settings']['vehicles'],link: '/pages/settings/vehicle'},
        { title: values['settings']['branches'],link: '/pages/settings/branch'}
      ],
      link: '/pages/settings',
      menuIcon: 'icon icon-mine',
    },
    {
      title: values['workorders']['title'],
      children: [
        { title: values['workorders']['workorder'], link: '/pages/workorder/work-orders' },
      ],
      link: '/pages/workorders',
      menuIcon: 'icon icon-mine',
    },
    {
      title: values['supplychains']['title'],
      children: [
        { title: values['supplychains']['supplychainlist'], link: '/pages/supplychain/supply-chain-list' },
        { title: values['supplychains']['directchallan'], link: '/pages/supplychain/direct-challan' },
        { title: values['supplychains']['challanlists'], link: '/pages/supplychain/challan-list' },
        { title: values['supplychains']['gatepasscreate'], link: '/pages/supplychain/gate-pass-create' },
        { title: values['supplychains']['createinvoice'], link: '/pages/supplychain/create-invoice' },
        { title: values['supplychains']['invoicelist'], link: '/pages/supplychain/invoice-list' },
        { title: values['supplychains']['salesReturn'], link: '/pages/supplychain/sales-return' },
        { title: values['supplychains']['salesReturnList'], link: '/pages/supplychain/sales-return-list' },
        
      ],
      link: '/pages/supplychains',
      menuIcon: 'icon icon-mine',
    },
  ];
}
