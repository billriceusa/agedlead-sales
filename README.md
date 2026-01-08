# Sales Presentations

A Next.js website for managing and displaying sales presentations, configured for deployment on Vercel.

## Getting Started

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Deployment to Vercel

This project is configured for easy deployment on Vercel:

1. **Push to GitHub**: Push your code to a GitHub repository
2. **Import to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
3. **Automatic Deployment**: Vercel will automatically detect Next.js and deploy your project

### Manual Deployment

You can also deploy using the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Project Structure

```
app/
  ├── layout.tsx          # Root layout
  ├── page.tsx            # Home page with presentation list
  ├── globals.css         # Global styles
  └── presentations/
      └── [slug]/
          └── page.tsx    # Dynamic presentation pages
```

## Adding New Presentations

To add a new presentation:

1. Update the `presentations` array in `app/page.tsx` with your new presentation
2. Add the presentation content to `app/presentations/[slug]/page.tsx` in the `presentationContent` object
3. Or create a data file/API route to manage presentations dynamically

## Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vercel** - Deployment platform
