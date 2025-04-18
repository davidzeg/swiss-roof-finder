# Switzerland Roofs Finder

This Next.js application allows users to search for locations in Switzerland and visualize building roofs on an interactive map. The app uses the Swiss federal geo-data API to fetch and display building data.

## Features

- Search for locations in Switzerland with autocomplete suggestions
- Display building roofs as interactive polygons on a map
- Select and highlight specific roof polygons by clicking
- State persistence across page refreshes
- Responsive design that works across different devices

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/davidzeg/swiss-roof-finder.git
cd swiss-roof-finder
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Implementation Details

This project uses several key technologies and approaches:

### API Integration

The application integrates with the Swiss Federal Geo-Information Platform API (geo.admin.ch):

- Location search with autocomplete: `https://api3.geo.admin.ch/rest/services/api/SearchServer`
- Building roof data retrieval: `https://api3.geo.admin.ch/rest/services/api/MapServer/identify`

### Map Visualization

- [OpenLayers](https://openlayers.org/) for interactive map rendering
- Custom polygon rendering for building roofs
- Click handlers for polygon selection and highlighting

### State Management

- URL parameters are used to persist user selections and map state
- State is encoded in the URL, allowing for easy sharing and restoration when the page is refreshed or revisited

### Technologies Used

- **Next.js 15.3.0**: React framework with server-side rendering capabilities
- **React 19**: For building the user interface
- **TypeScript**: For type safety and better developer experience
- **OpenLayers**: For map rendering and geographical data visualization

## Known Issues / Further Improvements

### Known Issues

- **Persistence Issues**: Upon page refresh, selected polygons may occasionally disappear. This happens because the URL-based state restoration process sometimes fails to properly reapply the selected state to polygons, particularly if the map view has changed significantly. This might be rectified by using a the browser's local storage instead.

- **Performance with Large Datasets**: When viewing areas with a high density of buildings, performance may degrade as many polygons need to be rendered simultaneously.

### Planned Improvements

1. **Enhanced State Persistence**: Implement a more robust state persistence mechanism that better handles map view changes and selected polygons.

2. **Performance Optimization**: Add polygon clustering for areas with high building density and implement lazy loading for roof data.

3. **User Interface Enhancements**:
   - Add tooltip information about selected buildings
   - Implement filtering options for roof types or properties
   - Add measurement tools for area calculations

4. **Add Stronger TypeScript Integration**: Due to time constraints, the project is not fully strongly typed, it would definitely be something to focus on improving.