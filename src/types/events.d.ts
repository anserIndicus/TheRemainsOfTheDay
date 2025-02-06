// 页面事件类型
interface PageEvent {
  type: string;
  timestamp: number;
  data?: any;
}

// 用户交互事件
interface UserInteractionEvent extends PageEvent {
  type: 'click' | 'scroll' | 'keypress' | 'mousemove';
  target: {
    tagName: string;
    className: string;
    id?: string;
  };
}

// 焦点事件
interface FocusEvent extends PageEvent {
  type: 'focus' | 'blur';
  timestamp: number;
}

// 内容变更事件
interface ContentChangeEvent extends PageEvent {
  type: 'content_added' | 'content_removed' | 'content_modified';
  node: {
    tagName: string;
    textContent?: string;
    attributes?: { [key: string]: string };
  };
}

// DOM 变更记录
interface DOMChangeRecord {
  type: 'childList' | 'attributes' | 'characterData';
  target: Element;
  addedNodes?: NodeList;
  removedNodes?: NodeList;
  attributeName?: string;
  oldValue?: string;
}

// 页面状态
interface PageState {
  url: string;
  title: string;
  scrollPosition: {
    x: number;
    y: number;
  };
  viewportSize: {
    width: number;
    height: number;
  };
  timestamp: number;
}

// 事件监听器类型
type EventListener = (event: PageEvent) => void;
type DOMChangeListener = (records: DOMChangeRecord[]) => void;
type StateChangeListener = (oldState: PageState, newState: PageState) => void;
