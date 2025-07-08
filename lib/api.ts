import { CURRENT_API_CONFIG } from '@/config/environment';

// API配置（从环境配置中获取）
export const API_CONFIG = CURRENT_API_CONFIG;

// 分析师数据接口类型
export interface AgentData {
  key: string;
  display_name: string;
  description: string;
  investing_style: string;
  order: number;
}

export interface AgentsResponse {
  agents: AgentData[];
}

// 分析请求接口类型
export interface AnalysisRequest {
  tickers: string[];
  selected_agents: string[];
  agent_models: Array<{
    agent_id: string;
    model_name: string;
    model_provider: string;
  }>;
  start_date: string;
  end_date: string;
  model_name: string;
  model_provider: string;
  initial_cash: number;
  margin_requirement: number;
}

// 分析响应接口类型
export interface ProgressResponse {
  type: 'progress';
  agent: string;
  ticker: string | null;
  status: string;
  timestamp: string;
  analysis: any;
}

export interface CompleteResponse {
  type: 'complete';
  data: {
    decisions: Record<string, {
      action: string;
      quantity: number;
      confidence: number;
      reasoning: string;
    }>;
    analyst_signals: Record<string, Record<string, {
      signal: string;
      confidence: number;
      reasoning: string;
    }>>;
  };
  timestamp: string | null;
}

export type AnalysisResponse = ProgressResponse | CompleteResponse;

// 获取分析师和分析类型数据
export const fetchAgents = async (): Promise<AgentsResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AGENTS}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
        'Accept': '*/*',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AgentsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

// 运行股票分析
export const runStockAnalysis = async (
  request: AnalysisRequest,
  onProgress?: (progress: ProgressResponse) => void,
  signal?: AbortSignal
): Promise<CompleteResponse> => {
  console.log('API请求URL:', `${API_CONFIG.BASE_URL}/hedge-fund/run`);
  console.log('API请求数据:', JSON.stringify(request, null, 2));
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/hedge-fund/run`, {
      method: 'POST',
      headers: {
        'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Host': '127.0.0.1:8000',
        'Connection': 'keep-alive'
      },
      body: JSON.stringify(request),
      signal: signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 处理SSE (Server-Sent Events) 格式的响应
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) {
      throw new Error('Unable to read response stream');
    }

    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // 处理SSE格式的数据
      const events = buffer.split('\n\n');
      buffer = events.pop() || ''; // 保留最后一个不完整的事件
      
      for (const event of events) {
        if (event.trim()) {
          try {
            const lines = event.split('\n');
            let eventType = '';
            let eventData = '';
            
            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventType = line.substring(6).trim();
              } else if (line.startsWith('data:')) {
                eventData = line.substring(5).trim();
              }
            }
            
            if (eventData) {
              console.log('SSE 事件数据:', eventData);
              const jsonData: AnalysisResponse = JSON.parse(eventData);
              console.log('解析后的数据:', jsonData);
              
              if (jsonData.type === 'progress' && onProgress) {
                onProgress(jsonData);
              } else if (jsonData.type === 'complete') {
                console.log('分析完成，返回结果');
                return jsonData;
              }
            }
          } catch (parseError) {
            console.warn('Failed to parse SSE event:', event, parseError);
          }
        }
      }
    }
    
    // 处理缓冲区中剩余的数据
    if (buffer.trim()) {
      try {
        const lines = buffer.split('\n');
        let eventData = '';
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            eventData = line.substring(5).trim();
            break;
          }
        }
        
        if (eventData) {
          const jsonData: AnalysisResponse = JSON.parse(eventData);
          if (jsonData.type === 'complete') {
            return jsonData;
          }
        }
      } catch (parseError) {
        console.warn('Failed to parse final SSE data:', buffer, parseError);
      }
    }
    
    throw new Error('Analysis did not complete successfully');
    
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Fetch request aborted by user');
      throw error;
    }
    console.error('Error running stock analysis:', error);
    throw error;
  }
};

// 数据转换函数：将API数据转换为组件需要的格式
export const transformAgentData = (agent: AgentData, isAnalyst: boolean = false) => {
  // 为分析师生成头像URL（使用unsplash随机头像）
  const avatarUrls = [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"
  ];
  
  const avatarUrl = avatarUrls[agent.order % avatarUrls.length];
  
  return {
    id: agent.key,
    name: agent.display_name,
    description: agent.description,
    avatar: avatarUrl,
    investingStyle: agent.investing_style,
    order: agent.order,
    isAnalyst
  };
};

// 投资风格到图标的映射
export const getIconForInvestingStyle = (style: string) => {
  const iconMap: Record<string, string> = {
    'quantitative_analytical': 'BarChart3',
    'value_investing': 'TrendingUp', 
    'contrarian_activist': 'Shield',
    'growth_investing': 'Target',
    'macro_global': 'Brain',
    'technical_analysis': 'Activity'
  };
  
  return iconMap[style] || 'Brain';
}; 