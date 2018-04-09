# 2.0.1 (2018-04-09)

- Databases are now sorted alphabetically
- When uploading is successful, two messages appear and both used to be green - now, the first one is yellow

# 2.0.0 (2018-04-09)

## User interface

- Removed cross-database overview of all bundle lists
- Moved bundle list generator to the top level in the main menu
- Added percentage of finished and commented bundles to bundle list view (was only in database view previously)
- Only list active editors in database list (instead of archived editors as well) 
- Project dashboard counts active and archived bundle lists separately 
- Show error when login has expired (used to fail silently)
- Be explicit about login/out via an external app
- Welcome screen: Hide username and password inputs when projectList is already available 

## API

- Removed pretty-print to save a lot of traffic (ca. 66%)
- Added new queries getBundleList and getDatabaseConfiguration - bundle lists are no longer included in projectInfo responses
- The backend now transmits machine-readable error codes and the frontend translates them to human-readable messages
- listProjects returns 'permission' field rather than 'level'

## Technical changes

- Major service re-design (split projectDataService into projectDataService and managerAPIService)
- Created config file app.config.ts
- Made sslmode in database connection configurable
- Severable minor bug fixes and improvements 

# 1.2.1 (2017-04-20)

- Bugfix: Pass secret token to backend when downloading a db

# 1.2.0 (2017-04-13)

- Login mechanism changed from project accounts to individual accounts

# 1.1.0 (2017-01-18)

- Bundle list generator now creates shuffled bundle lists per default (#3)
- Bundle list generator now offers preview of what the given regular 
  expressions would do
- Uploaded databases can now be merged into an existing database (#2)

# 1.0.0 (2017-01-16)

- After a few months in production, bumped version number to 1.0.0