#The code to accompany the Spatial Node Mongo blog piece

This code actually belongs to a [blog piece](https://openshift.redhat.com/community/blogs/using-nodejs-mongodb-express-for-your-spatial-web-service-and-its-free) written on OpenShift.com 

========

Running on OpenShift
----------------------------

Create an account at http://openshift.redhat.com/

Create a python-2.6 application and add a MongoDB cartridge to the app

    rhc app create nodews nodejs-0.6
    rhc cartridge add mongodb-2.2 --app nodews

Add this upstream flask repo


    cd pythonws
    git remote add upstream -m master git://github.com/openshift/openshift-mongo-flask-example.git
    git pull -s recursive -X theirs upstream master
    
Then push the repo upstream

    git push
    

Now, ssh into the application.

Add the data to a collection called parkpoints:

    mongoimport -d nodews -c parkpoints --type json --file $OPENSHIFT_REPO_DIR/parkcoord.json  -h $OPENSHIFT_MONGODB_DB_HOST  -u admin -p $OPENSHIFT_MONGODB_DB_PASSWORD

    
Create the spatial index on the documents:

    mongo
    use nodews
    db.parkpoints.ensureIndex( { pos : "2d" } );

Once the data is imported you can now checkout your application at:

    http://nodews-$yournamespace.rhcloud.com/ws/parks


License
-------

This code is dedicated to the public domain to the maximum extent
permitted by applicable law, pursuant to CC0
http://creativecommons.org/publicdomain/zero/1.0/
