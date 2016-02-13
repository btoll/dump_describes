define [
  'backbone'
  'underscore'
  'social-button-editor-path/views/list-visit-networks-view'
  'social-button-editor-path/collections/social-visit-network-collection'
], (Backbone, _, ListVisitNetworksView, SocialNetworkCollection) ->

  describe 'ListVisitNetworksView', ->

    beforeEach ->
      @eventBus = _.extend {}, Backbone.Events
      @mockModal =
        close: jasmine.createSpy 'mockModal'
      @mockCollection = new SocialNetworkCollection [
        {id: 'facebook', name: 'Facebook', status: 'on', placeholder_url: 'http://www.facebook.com/something'},
        {id: 'twitter', name: 'Twitter', status: 'on', placeholder_url: 'http://www.twitter.com/something'},
        {id: 'pinterest', name: 'Pinterest', status: 'off', placeholder_url: 'http://www.pinterest.com/something'},
        {id: 'cactus', name: 'Cactus', status: 'off', placeholder_url: 'http://www.cactus.com/something'},
      ]
      @view = new ListVisitNetworksView
        collection: @mockCollection
        eventBus: @eventBus
        parentModal: @mockModal
      spyOn(@view, 'render').and.callThrough()

      dropdownSpy = jasmine.createSpy 'fedDropdown'
      tooltipSpy = jasmine.createSpy 'fedTooltip'
      sortableSpy = jasmine.createSpy 'sortable'

      window.$.fn.fedDropdown = dropdownSpy
      window.$.fn.fedTooltip = tooltipSpy
      window.$.fn.sortable = sortableSpy

    describe '#initialize', ->

      it 'should render the supporting modal markup', ->
        expect(@view.$el.find('.Modal-heading').length).toBe 1
        expect(@view.$el.find('.Modal-close').length).toBe 1
        expect(@view.$el.find('#social-visit-url-list').length).toBe 1
        expect(@view.$el.find('#insert').length).toBe 1
        expect(@view.$el.find('#cancel').length).toBe 1

    describe '#render', ->

      it 'should setup sortable network fields', ->
        expect(window.$.fn.sortable).not.toHaveBeenCalled()
        @view.render()
        expect(window.$.fn.sortable).toHaveBeenCalled()

      it 'should setup a fed drop down', ->
        expect(window.$.fn.fedDropdown).not.toHaveBeenCalled()
        @view.render()
        expect(window.$.fn.fedDropdown).toHaveBeenCalled()

      it 'should setup fed tooltips', ->
        expect(window.$.fn.fedTooltip).not.toHaveBeenCalled()
        @view.render()
        expect(window.$.fn.fedTooltip).toHaveBeenCalled()

    fdescribe 'adding / removing networks', ->
      beforeEach ->
        @view.render()

      it 'clicking the trash can should remove the network from the list', ->
        expect(@view.$el.find('#social-visit-url-list li').length).toBe 2
        @view.$el.find('.delete-link[data-network-id="facebook"]').click()
        expect(@view.$el.find('#social-visit-url-list li').length).toBe 1

      it 'clicking the trash can should remove the network from the list even if the url was invalid', ->
        # VN-8915 found a bug with the network delete
        # * removeing the URL buts the edit form in an invalid state
        # * when the network is delete from the form it remains in an invalid
        #   state and break the insert action
        # * this is wrong
        expect(@view.$el.find('#social-visit-url-list li').length).toBe 2

        # set the url to an invalid state
        @view.$el.find('input[data-network-id="facebook"]')
          .val('asd')
          .trigger('keyup')

        # validation should now fail
        expect(@mockCollection.get('facebook').get('isValid')).toBe false

        # delete the network
        @view.$el.find('.delete-link[data-network-id="facebook"]').click()

        # validation should now pass. it has been deleted and is not left in an invalid state
        expect(@mockCollection.get('facebook').get('isValid')).toBe true

        # should delete the url value from the form field
        expect(@view.$el.find('#social-visit-url-list li').length).toBe 1

        # the network in the collection should be deleted
        deletedModel = @mockCollection.get('facebook')
        expect(deletedModel.get('status')).toBe 'off'

      it 'clicking all of the trash cans should close the modal and trigger an editor deletion', (done) ->
        @eventBus.on 'modal-insert', ->
          done()
        expect(@view.$el.find('#social-visit-url-list li').length).toBe 2
        @view.$el.find('.delete-link[data-network-id="facebook"]').click()
        @view.$el.find('.delete-link[data-network-id="twitter"]').click()
        expect(@mockModal.close).toHaveBeenCalled()
        expect(@mockCollection.where(status: 'on').length).toBe 0

      it 'clicking on a network in the dropdown should add it to the list', ->
        expect(@view.$el.find('#social-visit-url-list li').length).toBe 2
        @view.$el.find('.js-dropdownTrigger').click()
        @view.$el.find('.js-dropdown li[data-network-id="cactus"]').click()
        expect(@view.$el.find('#social-visit-url-list li').length).toBe 3

      it 'clicking on all the networks in the dropdown should disable the dropdown', ->
        expect(@view.$el.find('#social-visit-url-list li').length).toBe 2
        @view.$el.find('.js-dropdownTrigger').click()
        @view.$el.find('.js-dropdown li[data-network-id="cactus"]').click()
        @view.$el.find('.js-dropdown li[data-network-id="pinterest"]').click()
        expect(@view.$el.find('#social-visit-url-list li').length).toBe 4
        # TODO: Figure out why there are multiple dropdowns showingup?
        #expect(@view.$el.find('.js-dropdown.is-disabled').length).toBe 1

    describe 'url fields', ->
      beforeEach ->
        @view.render()

      it 'should be invalid if they do not start with http://', ->
        expect(@mockCollection.get('facebook').get('isValid')).toBe true
        @view.$el.find('input[data-network-id="facebook"]')
          .val('asd')
          .trigger('keyup')
        expect(@mockCollection.get('facebook').get('isValid')).toBe false

      it 'should prepend http:// if the user typed more then 4 characters that are not http', ->
        inputVal = @view.$el.find('input[data-network-id="twitter"]').val()
        expect(inputVal.indexOf('http://')).toBe -1
        text = 'twit'
        keysToType = text.split ''
        for key in keysToType
          currentVal = @view.$el.find('input[data-network-id="twitter"]').val()
          @view.$el.find('input[data-network-id="twitter"]')
            .val(currentVal + key)
            .trigger('keyup')
        finalVal = @view.$el.find('input[data-network-id="twitter"]').val()
        expect(finalVal).toEqual 'http://twit'

      it 'should prepend http:// the user pasted in a link that didnt already have a protocol', ->
        inputVal = @view.$el.find('input[data-network-id="twitter"]').val()
        expect(inputVal.indexOf('http://')).toBe -1
        text = 'twitter.com/jed_sed'
        @view.$el.find('input[data-network-id="twitter"]')
          .val(text)
          .trigger('paste')
        finalVal = @view.$el.find('input[data-network-id="twitter"]').val()
        expect(finalVal).toEqual 'http://twitter.com/jed_sed'

    describe 'buttons', ->
      beforeEach ->
        @view.render()

      it 'clicking the cancel button should close the modal', ->
        expect(@mockModal.close).not.toHaveBeenCalled()
        @view.$el.find('#cancel').click()
        expect(@mockModal.close).toHaveBeenCalled()

      it 'clicking insert should close the modal and trigger a modal-insert event', (done) ->
        expect(@mockModal.close).not.toHaveBeenCalled()
        @eventBus.on 'modal-insert', ->
          done()
        @view.$el.find('#insert').click()
        expect(@mockModal.close).toHaveBeenCalled()
