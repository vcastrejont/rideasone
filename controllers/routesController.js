module.exports = {
    /**
     * routesController.addRoute()
     */
    create: function(req, res) {

      console.log(req);
      
      event.save(function(err, event){
        if(err) {
            return res.json(500, {
                message: 'Error saving event',
                error: err
            });
        }
        return res.json({
                message: 'saved',
                _id: event._id
            });
      });
    }
};
