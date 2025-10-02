import { io, Socket } from 'socket.io-client'
import { useTodoList } from '@/stores/useTodoList'

class WebSocketService {
  private socket: Socket | null = null
  private store: any = null
  private sessionId: string = ''

  // constructor() {
  //   // Generate a session ID for this browser session
  //   this.sessionId = this.generateSessionId()
  // }

  // private generateSessionId(): string {
  //   return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  // }

  connect() {
    this.socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000', {
      transports: ['websocket'],
      // query: {
      //   sessionId: this.sessionId
      // }
    })

    this.store = useTodoList()
    this.setupEventListeners()
  }

  private setupEventListeners() {
    if (!this.socket) return

    // Listen for task updates
    this.socket.on('todoUpdated', (updatedTask) => {
      console.log('Task updated via WebSocket:', updatedTask)
      this.store.fetchTasks()
    })

    // Listen for new tasks
    this.socket.on('todoCreated', (newTask) => {
      console.log('New task created via WebSocket:', newTask)
      this.store.fetchTasks();
    })

    // Listen for deleted tasks
    this.socket.on('todoBulkDeleted', (taskId) => {
      console.log('Task deleted via WebSocket:', taskId)
      this.store.fetchTasks();
    })

    // Listen for bulk operations
    this.socket.on('tasks:refreshed', () => {
      this.store.fetchTasks(this.store.search)
    })

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server')
      // Join the global todo room
      this.joinTodoRoom()
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Join global todo room instead of user-specific room
  joinTodoRoom() {
    this.socket?.emit('join:todos')
  }

  // leaveTodoRoom() {
  //   this.socket?.emit('leave:todos')
  // }
}

export const webSocketService = new WebSocketService()