// User types
export type UserTag = "tenant" | "gold_customer" | "vip" | "family_customer";

export interface User {
  id: string;
  line_user_id: string;
  display_name: string | null;
  picture_url: string | null;
  tags: UserTag[];
  apartment_unit: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  line_user_id: string;
  display_name?: string;
  picture_url?: string;
  tags?: UserTag[];
  apartment_unit?: string;
}

// Promotion types
export type BusinessType = "apartment" | "gold" | "property" | "all";

export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  business_type: BusinessType;
  target_tags: UserTag[];
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

export interface CreatePromotionInput {
  title: string;
  description?: string;
  image_url?: string;
  business_type: BusinessType;
  target_tags?: UserTag[];
  is_active?: boolean;
  starts_at?: string;
  ends_at?: string;
}

// Announcement types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  business_type: BusinessType;
  target_tags: UserTag[];
  is_active: boolean;
  created_at: string;
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  business_type: BusinessType;
  target_tags?: UserTag[];
  is_active?: boolean;
}

// Repair request types
export type IssueType = "electrical" | "plumbing" | "ac" | "other";
export type RepairStatus = "pending" | "in_progress" | "resolved";

export interface RepairRequest {
  id: string;
  user_id: string | null;
  line_user_id: string;
  apartment_unit: string;
  issue_type: IssueType;
  description: string;
  status: RepairStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateRepairRequestInput {
  line_user_id: string;
  apartment_unit: string;
  issue_type: IssueType;
  description: string;
}

// Gold price types
export interface GoldPrice {
  id: string;
  buy_price: number;
  sell_price: number;
  gold_type: string;
  updated_at: string;
}

// Broadcast log types
export interface BroadcastLog {
  id: string;
  message: string;
  target_tags: UserTag[];
  sent_count: number;
  created_at: string;
}

// LINE types
export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

// Rich menu types
export interface RichMenuArea {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  action: RichMenuAction;
}

export type RichMenuAction =
  | { type: "uri"; uri: string; label?: string }
  | { type: "postback"; data: string; label?: string; displayText?: string }
  | { type: "message"; text: string; label?: string }
  | { type: "richmenuswitch"; richMenuAliasId: string; data: string; label?: string };

export interface RichMenu {
  size: { width: number; height: number };
  selected: boolean;
  name: string;
  chatBarText: string;
  areas: RichMenuArea[];
}

// Admin API response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalUsers: number;
  tenants: number;
  goldCustomers: number;
  vipUsers: number;
  activePromotions: number;
  pendingRepairs: number;
  currentGoldBuyPrice: number;
  currentGoldSellPrice: number;
}
