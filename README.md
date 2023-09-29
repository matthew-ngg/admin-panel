# admin-panel

### Choice of Package
1. **material-ui**\
Using material-ui allows me to get a well-styled TextField with no effort to save some time

2. **styled-components**\
most components are decorated through styled-components, I personally perfer separate
styling and rending section as much as possible, so I didn't use Tailwind

3. **date-fns**\
standard library for formatting time, converting timezone

4. **vercel**\
vercel supports easy and fast deployment for both client and server

### Potential Improvement
1. **use a database**\
For the scope of this coding assessment, the benefit of using a database seems to be\
very limited, it requires lots of boilerplates, e.g. setting up database, creating models etc.\
It sounds a bit over-engineered to me so I choose to load the json file whenever the server\
starts, where it also achieves
  - shared data source if server didn't restarts
  - allow data editing with immediate response
\
but for the future, if we expected more resources into this project, using a database would\
be a better choice

2. **don't use material-ui**\
For now, TextField and Checkbox are the only two components imported from material-ui, other components\
such as Buttons, Table can be imported from material-ui as well, but I want to follow the UI as much\
as possible so I decided to use styled-components to customize each component to match the design\
But it is not wise to import the entire library for only one or two component.
\
So a better choice is to fully adopt material-ui components (colors and styling may not be that harsh\
for a internal system), so we don't have to take care of css that much; or we build out own TextField\
and Checkbox component so we can deprecate material-ui for smaller bundle size

3. **better UX**\
some function such as bulk decline and confirmation pop up is not added due to time constraint

4. **login page**\
a simple OAuth login can be done to restrict internal user to access the system, as well as adding\
access right for access control. But then this requires a database for storing user model and access\
right related fields, so this is not added in this assessment

5. **api domain**\
ideally we should put the api domain in environment variable

### Assumptions
1. **no cross day shifts**\
for the data source, each shift will be finished within the day so it wouldn't appears in two different card\

2. **all shifts are done in Hong Kong**\
we have a time string from the data source, but it could be in different country with different timezone. But\
since we do not have the location specified, all shifts are assumed to be done in Hong Kong