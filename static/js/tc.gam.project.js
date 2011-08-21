tc = tc || {};
tc.gam = tc.gam || {};
tc.gam.project = function(app, dom) {
    // Create an object to handle widget visibility events
    tc.gam.widgetVisibilityHandler();

    var widget_options = {
        app: app,                                   //for merlin
        project_data: app.app_page.data.project,    //project specific data
        user: app.app_page.user,                    //user data
        project_user: app.app_page.project_user,    //project user data
        media_root: app.app_page.media_root         //root directory for images and such
    };

    app.components.project_widgets = {
        'infopane': tc.gam.project_widgets.infopane(
            tc.jQ.extend(widget_options, { name:'infopane', dom: dom.find('.box.mission') })
        ),
        'resources': tc.gam.project_widgets.resources(
            tc.jQ.extend(widget_options, { name:'resources', dom: dom.find('.box.resources') })
        ),
        'related_resources': tc.gam.project_widgets.related_resources(
            tc.jQ.extend(widget_options, { name:'related_resources', dom: dom.find('.box.related-resources') })
        )/*,
        'add_link': tc.gam.project_widgets.add_link(
            tc.jQ.extend(widget_options, { dom: dom.find('.box.add-link') })
        ),
        'conversation': tc.gam.project_widgets.conversation(
            tc.jQ.extend(widget_options, { dom: dom.find('.box.conversation') })
        ),
        'members': tc.gam.project_widgets.members(
            tc.jQ.extend(widget_options, { dom: dom.find('.box.members') })
        )*/
    };

    /*
    app: app,
    data: app_page.data.project, //change to app_page.data
    project_user: app_page.project_user,
    dom: tc.jQ('.continent.project')
    */
};