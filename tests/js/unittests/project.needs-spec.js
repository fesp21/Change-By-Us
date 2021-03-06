/*--------------------------------------------------------------------
  Copyright (c) 2011 Local Projects. All rights reserved.
  Licensed under the Affero GNU GPL v3, see LICENSE for more details.
 --------------------------------------------------------------------*/

if (window.EnvJasmine) {
    EnvJasmine.load(EnvJasmine.jsDir + 'tc.gam.base.js');
    EnvJasmine.load(EnvJasmine.jsDir + 'tc.util.js');
    EnvJasmine.load(EnvJasmine.jsDir + 'pages/project.data.js');
    EnvJasmine.load(EnvJasmine.jsDir + 'pages/project.needs.js');
}

describe('project.needs.js', function () {
    var need_widget,
        mock_options = {
            //for merlin
            app: {
                components: {
                    modal: {}
                }
            },
            //project specific data
            project_data: {
                info: {
                    owner: { u_id: 100 }
                }
            },
            //user data
            user: {
                is_admin: false,
                is_leader: false,
                u_id: 5
            },
            //project user data
            project_user: {
                is_member: false,
                is_project_admin: false
            },
            //root directory for images and such
            media_root: 'http://cbumedia.com',
            dom: tc.jQ('body'),
            name: 'test'
        },
        mock_vol_need = {
          address: "Code for America",
          date: "2011-10-01",
          description: "to garden and pull weeds and stuff. to garden and pull weeds and stuff. to garden and pull weeds and stuff. the quick brown fox jumped over the lazy dog.",
          display_address: "Code for America",
          display_date: "October 1st",
          duration: "6",
          event: null,
          event_id: null,
          id: "1",
          project_id: "1",
          quantity: "4",
          quantity_committed: "3",
          request: "gardeners",
          time: "11:00 am",
          type: "volunteer",
          volunteers: [{"display_name": "John D.", "description": null, "image_id": "1", "email": "john.doe@codeforamerica.org", "location_id": "0", "id": "1"},
                       {"display_name": "John E.", "description": null, "image_id": "1", "email": "john.eoe@codeforamerica.org", "location_id": "0", "id": "2"},
                       {"display_name": "John F.", "description": null, "image_id": "1", "email": "john.foe@codeforamerica.org", "location_id": "0", "id": "3"}]
        },
        mock_inkind_need = {
          address: "",
          date: "",
          description: "for nails, of course",
          display_address: "",
          display_date: "",
          duration: "6",
          event: null,
          event_id: null,
          id: "5",
          project_id: "3",
          quantity: "8",
          quantity_committed: "5",
          request: "hammers",
          time: "",
          type: "inkind",
          volunteers: [{"display_name": "John D.", "description": null, "image_id": "1", "email": "john.doe@codeforamerica.org", "location_id": "0", "id": "1"},
                       {"display_name": "John E.", "description": null, "image_id": "1", "email": "john.eoe@codeforamerica.org", "location_id": "0", "id": "2"},
                       {"display_name": "John F.", "description": null, "image_id": "1", "email": "john.foe@codeforamerica.org", "location_id": "0", "id": "3"}]
        };

    beforeEach(function() {
        need_widget = tc.gam.project_widgets.needs(mock_options);
    });

    describe('_isVolunteer', function () {
        var vols;
        
        beforeEach(function(){
            vols = [{ id: '1'}, { id: 2} ];
        });
        
        it('returns true if the user is in a list of volunteers', function() {
            expect(need_widget._isVolunteer(1, vols)).toEqual(true);
            expect(need_widget._isVolunteer('1', vols)).toEqual(true);
            expect(need_widget._isVolunteer(2, vols)).toEqual(true);
            expect(need_widget._isVolunteer('2', vols)).toEqual(true);
        });

        it('returns false if the user is not in a list of volunteers', function() {
            var not_defined;

            expect(need_widget._isVolunteer(3, vols)).toEqual(false);
            expect(need_widget._isVolunteer('3', vols)).toEqual(false);
            
            expect(need_widget._isVolunteer(not_defined, vols)).toEqual(false);
            expect(need_widget._isVolunteer(null, vols)).toEqual(false);
        });
    });
    
    describe('_getDetailTemplateData', function () {
        var vol_need_details, inkind_need_details;
        beforeEach(function(){
            vol_need_details = need_widget._getDetailTemplateData(mock_vol_need);
            inkind_need_details = need_widget._getDetailTemplateData(mock_inkind_need);
        });

        it('creates a "day" template function', function() {
            expect(vol_need_details.day).toBeTruthy();
            expect(inkind_need_details.day).toBeTruthy();
        });
        
        it('creates a "month" template function', function() {
            expect(vol_need_details.month).toBeTruthy();
            expect(inkind_need_details.month).toBeTruthy();
        });

        it('creates a "isVolunteer" template function', function() {
            expect(vol_need_details.isVolunteer()).toEqual(true);
            expect(inkind_need_details.isVolunteer()).toEqual(false);
        });

        it('creates a "isInKind" template function', function() {
            expect(vol_need_details.isInKind()).toEqual(false);
            expect(inkind_need_details.isInKind()).toEqual(true);
        });

        it('creates a "has_first" template property if there is a least one volunteer', function() {
            expect(vol_need_details.has_first).toEqual(true);
            expect(inkind_need_details.has_first).toEqual(true);
        });
        
        it('creates a "first_vol" template property if there is a least one volunteer', function() {
            expect(vol_need_details.first_vol).toBeTruthy();
            expect(vol_need_details.first_vol.id).toEqual('1');

            expect(inkind_need_details.first_vol).toBeTruthy();
            expect(inkind_need_details.first_vol.id).toEqual('1');
        });
        
        it('modifies "volunteers" to shift the first volunteer off the list', function() {
            expect(mock_vol_need.volunteers.length).toEqual(3);
            expect(vol_need_details.volunteers.length).toEqual(2);
            expect(need_widget._isVolunteer('1', vol_need_details.volunteers)).toEqual(false);

            expect(mock_inkind_need.volunteers.length).toEqual(3);
            expect(inkind_need_details.volunteers.length).toEqual(2);
            expect(need_widget._isVolunteer('1', inkind_need_details.volunteers)).toEqual(false);
        });
        
        it('creates a "vol_count_minus_one" template property to be the total volunteers minus 1', function() {
            expect(vol_need_details.vol_count_minus_one).toEqual(mock_vol_need.volunteers.length-1);
            expect(vol_need_details.vol_count_minus_one).toEqual(vol_need_details.volunteers.length);

            expect(inkind_need_details.vol_count_minus_one).toEqual(mock_inkind_need.volunteers.length-1);
            expect(inkind_need_details.vol_count_minus_one).toEqual(inkind_need_details.volunteers.length);
        });
        
        it('creates a "avatar" template function', function() {
            expect(vol_need_details.avatar).toBeTruthy();

            expect(inkind_need_details.avatar).toBeTruthy();
        });
    });


    describe('_getVolunteerButtonConfig', function () {
        var vols, not_defined;
        
        beforeEach(function() {
            vols = [{"display_name": "John D.", "description": null, "image_id": "1", "email": "john.doe@codeforamerica.org", "location_id": "0", "id": "1"},
                    {"display_name": "John E.", "description": null, "image_id": "1", "email": "john.eoe@codeforamerica.org", "location_id": "0", "id": "2"},
                    {"display_name": "John F.", "description": null, "image_id": "1", "email": "john.foe@codeforamerica.org", "location_id": "0", "id": "3"}]; 
        });
        
        it('returns "I am helping" if the user is one of the volunteers', function() {
            expect(need_widget._getVolunteerButtonConfig(5, vols, 1)).toEqual({cssClass: 'in-process', text: 'I am helping'});
        });
        
        it('returns "I can help" if the user is not one of the volunteers and more volunteers are needed', function() {
            expect(need_widget._getVolunteerButtonConfig(5, vols, 6)).toEqual({cssClass: 'active', text: 'I can help'});
        });

        it('returns "Complete!" if the user is not one of the volunteers and no more volunteers are needed', function() {
            expect(need_widget._getVolunteerButtonConfig(3, vols, 6)).toEqual({cssClass: 'complete', text: 'Complete!'});
        });

        it('returns "I am helping" if the user is one of the volunteers, even if no more volunteers are needed', function() {
            expect(need_widget._getVolunteerButtonConfig(3, vols, 1)).toEqual({cssClass: 'in-process', text: 'I am helping'});
        });
        
        it('returns "Complete!" if no more volunteers are needed and no user is logged in', function() {
            expect(need_widget._getVolunteerButtonConfig(3, vols, not_defined)).toEqual({cssClass: 'complete', text: 'Complete!'});
        });

        it('returns "I can help" if more volunteers are needed and no user is logged in', function() {
            expect(need_widget._getVolunteerButtonConfig(5, vols, null)).toEqual({cssClass: 'active', text: 'I can help'});
        });
    });

    describe('_getProgressElementWidth', function () {
        it('gets the width of the progress element', function() {
            expect(need_widget._getProgressElementWidth(100, 1, 4)).toEqual(25);
        });
    });
    
    describe('_updateVolunteerProgress', function () {
        var $container, vol_need, inkind_need;
        beforeEach(function(){
            $container = tc.jQ('<div class="volunteer-details"> \
                <div class="volunteer-count">We have <strong>0</strong> volunteers</div> \
                <div class="progress-wrapper"><div class="progress"><div class="progress-pin"></div></div></div> \
                <a class="help-link active" href="#">I can help</a> \
                </div>'
            );
            vol_need = mock_vol_need;
            inkind_need = mock_inkind_need;
        });
        
        it('sets the number of people who have volunteered', function() {
            need_widget._updateVolunteerProgress($container, vol_need);
            
            expect($container.find('.volunteer-count strong').text()).toEqual('3');
        });
        
        it('sets the number of things that have been donated', function() {
            need_widget._updateVolunteerProgress($container, inkind_need);
            
            expect($container.find('.volunteer-count strong').text()).toEqual('5');
        });
    });
    
    describe('_getUserId', function () {
        it('gets the user id if it exists', function() {
            expect(need_widget._getUserId()).toEqual(5);
        });
        
        it('return null if the user id does not exists', function() {
            need_widget = tc.gam.project_widgets.needs(tc.jQ.extend(true, mock_options, { user: null }) );
            expect(need_widget._getUserId()).toEqual(null);
        });

    });
});