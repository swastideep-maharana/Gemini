# Gemini Chat - AI Conversational Frontend

A fully functional, responsive, and visually appealing frontend for a Gemini-style conversational AI chat application. Built with Next.js 15, TypeScript, Tailwind CSS, and integrated with Google's Gemini AI API for intelligent conversations.

##  

[Live Demo]([https://gemini-theta-woad.vercel.app/])

##  Features

###  Authentication

- **OTP-based Login/Signup** with country code selection
- **Real-time country data** from restcountries.com API
- **Form validation** using React Hook Form + Zod
- **Simulated OTP flow** with timeout delays
- **Persistent authentication** using localStorage

###  Dashboard

- **Chatroom management** - Create, delete, and search chatrooms
- **Debounced search** with 300ms delay
- **Responsive grid layout** for chatroom cards
- **Toast notifications** for all actions
- **User session display** with logout functionality

###  Chat Interface

- **Real-time messaging** with user and AI messages
- **Gemini AI Integration** - Powered by Google's Gemini Pro API
- **Conversation Context** - Each chatroom maintains its own conversation history
- **Typing indicators** - "Gemini is thinking..." with animated dots
- **Auto-scroll** to latest messages
- **Infinite scroll** for older messages (simulated)
- **Image upload support** with preview and validation
- **Copy-to-clipboard** on message hover
- **Message timestamps** and responsive design
- **Loading skeletons** for better UX

###  Global UX Features

- **Dark/Light mode toggle** with persistent storage
- **Mobile responsive design** for all screen sizes
- **Keyboard accessibility** for main interactions
- **Toast notifications** for all key actions
- **Loading states** and error handling
- **Smooth animations** and transitions

## 🛠️ Tech Stack

| Feature              | Technology               |
| -------------------- | ------------------------ |
| **Framework**        | Next.js 15 (App Router)  |
| **Language**         | TypeScript               |
| **State Management** | Zustand                  |
| **Form Validation**  | React Hook Form + Zod    |
| **Styling**          | Tailwind CSS             |
| **Icons**            | React Icons (Feather)    |
| **Notifications**    | React Hot Toast          |
| **AI Integration**   | Google Gemini API (REST) |
| **Deployment**       | Vercel                   |

##  AI Features

### Gemini AI Integration

- **Real AI Responses**: Powered by Google's Gemini Pro model via REST API
- **Direct API Calls**: Uses fetch API for reliable communication
- **Intelligent Responses**: Context-aware, natural language processing
- **Error Handling**: Graceful fallback to simulated responses if API fails
- **Rate Limiting**: Built-in throttling and error recovery

### Chat Features

- **Natural Language**: Human-like responses with personality
- **Image Recognition**: Acknowledges when images are shared
- **Fallback System**: Reliable responses even when API is unavailable
- **Simple Integration**: No external SDK dependencies

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── ImageUploader.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageSkeleton.tsx
│   │   └── ThemeToggle.tsx
│   ├── store/              # Zustand state management
│   │   ├── authStore.ts    # Authentication state
│   │   ├── chatStore.ts    # Chatroom management
│   │   ├── messageStore.ts # Message handling
│   │   └── chatService.ts  # AI chat service
│   ├── utils/              # Utility functions
│   │   ├── fetchCountries.ts
│   │   └── geminiApi.ts    # Gemini AI integration
│   ├── dashboard/          # Dashboard page
│   ├── login/             # Authentication page
│   ├── chatroom/[id]/     # Dynamic chatroom pages
│   └── globals.css        # Global styles
├── hooks/                 # Custom React hooks
│   └── useDebounce.ts
└── public/               # Static assets
```

##  Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API Key (optional, fallback responses available)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/gemini-chat-clone.git
   cd gemini-chat-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables (optional)**
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

##  Implementation Details

### Authentication Flow

- **Country Selection**: Fetches countries from restcountries.com API
- **Phone Validation**: Uses Zod schema for phone number validation
- **OTP Simulation**: setTimeout to simulate real OTP sending/verification
- **Persistent Login**: Stores auth data in localStorage

### State Management (Zustand)

- **authStore**: Handles user authentication and session
- **chatStore**: Manages chatroom CRUD operations with localStorage
- **messageStore**: Handles message persistence and pagination

### AI Integration

- **Gemini API**: Real AI responses using Google's Gemini Pro model
- **Chat Sessions**: Each chatroom maintains its own conversation context
- **Error Handling**: Graceful fallback to simulated responses
- **Rate Limiting**: Built-in throttling for API calls

### Chat Features

- **Contextual AI**: Maintains conversation history per chatroom
- **Real Responses**: Powered by Gemini Pro API
- **Image Support**: Acknowledges image uploads
- **Fallback System**: Reliable responses even when API fails

### Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Breakpoint system**: sm, md, lg, xl
- **Flexible layouts** that adapt to screen size
- **Touch-friendly** interface elements

### Performance Optimizations

- **Debounced search** (300ms delay)
- **Lazy loading** for images
- **Memoized components** with React.memo
- **Efficient re-renders** with Zustand selectors

## 🎨 UI/UX Features

### Dark Mode

- **System preference detection**
- **Manual toggle** with persistent storage
- **Smooth transitions** between themes

### Loading States

- **Skeleton components** for messages
- **Spinner animations** for async operations
- **Progressive loading** indicators

### Accessibility

- **Keyboard navigation** support
- **ARIA labels** and semantic HTML
- **Focus management** for form inputs
- **Screen reader** friendly components

## 📱 Mobile Responsiveness

The application is fully responsive with:

- **Touch-friendly** buttons and inputs
- **Optimized layouts** for small screens
- **Proper spacing** and typography scaling
- **Gesture support** for mobile interactions

## �� Customization

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_NAME=Gemini Chat
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### AI Configuration

The Gemini AI integration can be customized in `src/app/utils/geminiApi.ts`:

- **Model**: Change from `gemini-pro` to `gemini-pro-vision` for image support
- **Temperature**: Adjust creativity (0.0-1.0)
- **Max Tokens**: Control response length
- **Fallback Responses**: Customize fallback messages

### Styling

- **Tailwind CSS** for utility-first styling
- **Custom CSS variables** for theming
- **Component-based** styling approach

### Adding Features

1. **New Components**: Add to `src/app/components/`
2. **State Management**: Extend existing stores or create new ones
3. **Pages**: Add to `src/app/` following Next.js 13+ conventions
4. **Utilities**: Add to `src/app/utils/` or `src/hooks/`



