_ = require('underscore');

module.exports = {
  initialize: function(api, next){
    
    api.actions.addMiddleware({
      name: 'tagFormatting',
      global: true,
      priority: 105,
      preProcessor: function(data, next){

        if(data.params.tags){ // the following code does its best to convert multi-format tag arrays into a JS Array object.
          try{
            var tags = JSON.parse(data.params.tags) // parse JSON
          }catch(err){
            var tags = data.params.tags // if JSON parsing fails, continue
          }

          if(_.isNull(tags)){ // set an empty array for a NULL input
            data.params.tags = []
          }else if(_.isArray(tags)){ // pass the array if it's already an array
            data.params.tags = tags;
          }else{
            data.params.tags = tags.split(',') // last ditch effort to turn comma-delimited data into the array
                                               // if the tags param is just a string, it'll be set as the first array item
            data.params.tags = _.map(data.params.tags, function(tag){
              return tag.trim().toLowerCase(); // trim the whitespace and convert to lowercase
            })
          }
        }

        next();

      }
    })
    
    next();
  }
};