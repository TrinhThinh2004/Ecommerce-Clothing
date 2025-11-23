// src/pages/Admin/AdminSettings.tsx
import { useState, useEffect } from "react";
import {
  Store,
  CreditCard,
  Truck,
  Mail,
  Globe,
  Bell,
  Shield,
  Save,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import AdminLayout from "../_Components/AdminLayout";

type StoreSettings = {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeDescription: string;
  currency: string;
  timezone: string;
};

type PaymentSettings = {
  codEnabled: boolean;
  momoEnabled: boolean;
  vnpayEnabled: boolean;
  momoApiKey: string;
  vnpayMerchantId: string;
};

type ShippingSettings = {
  flatRateEnabled: boolean;
  flatRatePrice: number;
  freeShippingThreshold: number;
  estimatedDays: number;
  shippingZones: string[];
};

type NotificationSettings = {
  emailOrderConfirm: boolean;
  emailOrderStatus: boolean;
  emailNewCustomer: boolean;
  smsOrderConfirm: boolean;
  smsOrderStatus: boolean;
};

type SecuritySettings = {
  requireEmailVerification: boolean;
  allowGuestCheckout: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<
    "store" | "payment" | "shipping" | "notification" | "security"
  >("store");
  const [saving, setSaving] = useState(false);

  // Store settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: "ICONDENIM Store",
    storeEmail: "admin@icondenim.com",
    storePhone: "0901234567",
    storeAddress: "123 Nguyễn Văn Linh, Q7, TP.HCM",
    storeDescription: "Thời trang nam cao cấp",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",
  });

  // Payment settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    codEnabled: true,
    momoEnabled: true,
    vnpayEnabled: false,
    momoApiKey: "",
    vnpayMerchantId: "",
  });

  // Shipping settings
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    flatRateEnabled: true,
    flatRatePrice: 30000,
    freeShippingThreshold: 500000,
    estimatedDays: 3,
    shippingZones: ["TP.HCM", "Hà Nội", "Đà Nẵng"],
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailOrderConfirm: true,
      emailOrderStatus: true,
      emailNewCustomer: false,
      smsOrderConfirm: false,
      smsOrderStatus: false,
    });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    requireEmailVerification: false,
    allowGuestCheckout: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
  });

  useEffect(() => {
    loadSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSettings = async () => {
    try {
      // Load settings from localStorage or API
      const savedSettings = localStorage.getItem("adminSettings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setStoreSettings(parsed.store || storeSettings);
        setPaymentSettings(parsed.payment || paymentSettings);
        setShippingSettings(parsed.shipping || shippingSettings);
        setNotificationSettings(parsed.notification || notificationSettings);
        setSecuritySettings(parsed.security || securitySettings);
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage or API
      const settings = {
        store: storeSettings,
        payment: paymentSettings,
        shipping: shippingSettings,
        notification: notificationSettings,
        security: securitySettings,
      };
      localStorage.setItem("adminSettings", JSON.stringify(settings));
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success("Đã lưu cấu hình thành công");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Không thể lưu cấu hình");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "store" as const, label: "Cửa hàng", icon: <Store className="h-4 w-4" /> },
    { id: "payment" as const, label: "Thanh toán", icon: <CreditCard className="h-4 w-4" /> },
    { id: "shipping" as const, label: "Vận chuyển", icon: <Truck className="h-4 w-4" /> },
    { id: "notification" as const, label: "Thông báo", icon: <Bell className="h-4 w-4" /> },
    { id: "security" as const, label: "Bảo mật", icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <AdminLayout
      title="Cấu hình cửa hàng"
      actions={
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        {/* Tabs sidebar */}
        <div className="rounded-xl border border-neutral-200 bg-white p-2 h-fit">
          <nav className="grid gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition",
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "text-neutral-800 hover:bg-neutral-100",
                ].join(" ")}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-neutral-200 bg-white">
          {activeTab === "store" && (
            <StoreSettingsPanel
              settings={storeSettings}
              onChange={setStoreSettings}
            />
          )}
          {activeTab === "payment" && (
            <PaymentSettingsPanel
              settings={paymentSettings}
              onChange={setPaymentSettings}
            />
          )}
          {activeTab === "shipping" && (
            <ShippingSettingsPanel
              settings={shippingSettings}
              onChange={setShippingSettings}
            />
          )}
          {activeTab === "notification" && (
            <NotificationSettingsPanel
              settings={notificationSettings}
              onChange={setNotificationSettings}
            />
          )}
          {activeTab === "security" && (
            <SecuritySettingsPanel
              settings={securitySettings}
              onChange={setSecuritySettings}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

/* ================= Panels ================= */

function StoreSettingsPanel({
  settings,
  onChange,
}: {
  settings: StoreSettings;
  onChange: (s: StoreSettings) => void;
}) {
  return (
    <div className="p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Store className="h-5 w-5" />
          Thông tin cửa hàng
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Cấu hình thông tin cơ bản của cửa hàng
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Tên cửa hàng"
          value={settings.storeName}
          onChange={(v) => onChange({ ...settings, storeName: v })}
          required
        />
        <FormField
          label="Email"
          type="email"
          value={settings.storeEmail}
          onChange={(v) => onChange({ ...settings, storeEmail: v })}
          icon={<Mail className="h-4 w-4" />}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Số điện thoại"
          value={settings.storePhone}
          onChange={(v) => onChange({ ...settings, storePhone: v })}
          required
        />
        <FormField
          label="Múi giờ"
          value={settings.timezone}
          onChange={(v) => onChange({ ...settings, timezone: v })}
          icon={<Globe className="h-4 w-4" />}
        />
      </div>

      <FormField
        label="Địa chỉ"
        value={settings.storeAddress}
        onChange={(v) => onChange({ ...settings, storeAddress: v })}
      />

      <div>
        <label className="mb-2 block text-sm font-semibold text-neutral-700">
          Mô tả cửa hàng
        </label>
        <textarea
          value={settings.storeDescription}
          onChange={(e) =>
            onChange({ ...settings, storeDescription: e.target.value })
          }
          rows={4}
          className="w-full rounded-lg border border-neutral-300 p-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
        />
      </div>
    </div>
  );
}

function PaymentSettingsPanel({
  settings,
  onChange,
}: {
  settings: PaymentSettings;
  onChange: (s: PaymentSettings) => void;
}) {
  return (
    <div className="p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Phương thức thanh toán
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Cấu hình các phương thức thanh toán được hỗ trợ
        </p>
      </div>

      <div className="space-y-4">
        <SwitchField
          label="Thanh toán khi nhận hàng (COD)"
          checked={settings.codEnabled}
          onChange={(v) => onChange({ ...settings, codEnabled: v })}
          description="Khách hàng thanh toán tiền mặt khi nhận hàng"
        />

        <SwitchField
          label="Ví điện tử MoMo"
          checked={settings.momoEnabled}
          onChange={(v) => onChange({ ...settings, momoEnabled: v })}
          description="Thanh toán qua ví MoMo"
        />

        {settings.momoEnabled && (
          <div className="ml-8 pl-4 border-l-2">
            <FormField
              label="MoMo API Key"
              type="password"
              value={settings.momoApiKey}
              onChange={(v) => onChange({ ...settings, momoApiKey: v })}
              placeholder="Nhập API key từ MoMo"
            />
          </div>
        )}

        <SwitchField
          label="VNPAY"
          checked={settings.vnpayEnabled}
          onChange={(v) => onChange({ ...settings, vnpayEnabled: v })}
          description="Thanh toán qua cổng VNPAY"
        />

        {settings.vnpayEnabled && (
          <div className="ml-8 pl-4 border-l-2">
            <FormField
              label="VNPAY Merchant ID"
              type="password"
              value={settings.vnpayMerchantId}
              onChange={(v) => onChange({ ...settings, vnpayMerchantId: v })}
              placeholder="Nhập Merchant ID từ VNPAY"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ShippingSettingsPanel({
  settings,
  onChange,
}: {
  settings: ShippingSettings;
  onChange: (s: ShippingSettings) => void;
}) {
  return (
    <div className="p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Cấu hình vận chuyển
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Thiết lập phí và chính sách vận chuyển
        </p>
      </div>

      <div className="space-y-4">
        <SwitchField
          label="Phí vận chuyển cố định"
          checked={settings.flatRateEnabled}
          onChange={(v) => onChange({ ...settings, flatRateEnabled: v })}
          description="Áp dụng phí ship cố định cho mọi đơn hàng"
        />

        {settings.flatRateEnabled && (
          <div className="ml-8 pl-4 border-l-2 grid gap-4 sm:grid-cols-2">
            <FormField
              label="Phí vận chuyển (VNĐ)"
              type="number"
              value={settings.flatRatePrice}
              onChange={(v) =>
                onChange({ ...settings, flatRatePrice: Number(v) })
              }
            />
            <FormField
              label="Miễn phí ship từ (VNĐ)"
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(v) =>
                onChange({ ...settings, freeShippingThreshold: Number(v) })
              }
            />
          </div>
        )}

        <FormField
          label="Thời gian giao hàng ước tính (ngày)"
          type="number"
          value={settings.estimatedDays}
          onChange={(v) => onChange({ ...settings, estimatedDays: Number(v) })}
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Khu vực giao hàng
          </label>
          <div className="flex flex-wrap gap-2">
            {settings.shippingZones.map((zone, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm"
              >
                {zone}
                <button
                  onClick={() =>
                    onChange({
                      ...settings,
                      shippingZones: settings.shippingZones.filter(
                        (_, idx) => idx !== i
                      ),
                    })
                  }
                  className="hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationSettingsPanel({
  settings,
  onChange,
}: {
  settings: NotificationSettings;
  onChange: (s: NotificationSettings) => void;
}) {
  return (
    <div className="p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Thông báo
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Cấu hình thông báo email và SMS
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-700 mb-3">
            Thông báo Email
          </h3>
          <div className="space-y-3">
            <SwitchField
              label="Xác nhận đơn hàng"
              checked={settings.emailOrderConfirm}
              onChange={(v) => onChange({ ...settings, emailOrderConfirm: v })}
              description="Gửi email khi khách đặt hàng thành công"
            />
            <SwitchField
              label="Cập nhật trạng thái đơn hàng"
              checked={settings.emailOrderStatus}
              onChange={(v) => onChange({ ...settings, emailOrderStatus: v })}
              description="Gửi email khi trạng thái đơn hàng thay đổi"
            />
            <SwitchField
              label="Khách hàng mới"
              checked={settings.emailNewCustomer}
              onChange={(v) => onChange({ ...settings, emailNewCustomer: v })}
              description="Gửi email chào mừng khách hàng mới"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-neutral-700 mb-3">
            Thông báo SMS
          </h3>
          <div className="space-y-3">
            <SwitchField
              label="Xác nhận đơn hàng"
              checked={settings.smsOrderConfirm}
              onChange={(v) => onChange({ ...settings, smsOrderConfirm: v })}
              description="Gửi SMS khi khách đặt hàng thành công"
            />
            <SwitchField
              label="Cập nhật trạng thái đơn hàng"
              checked={settings.smsOrderStatus}
              onChange={(v) => onChange({ ...settings, smsOrderStatus: v })}
              description="Gửi SMS khi trạng thái đơn hàng thay đổi"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySettingsPanel({
  settings,
  onChange,
}: {
  settings: SecuritySettings;
  onChange: (s: SecuritySettings) => void;
}) {
  return (
    <div className="p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Bảo mật
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Cấu hình bảo mật và quyền truy cập
        </p>
      </div>

      <div className="space-y-4">
        <SwitchField
          label="Yêu cầu xác thực email"
          checked={settings.requireEmailVerification}
          onChange={(v) =>
            onChange({ ...settings, requireEmailVerification: v })
          }
          description="Khách hàng phải xác thực email trước khi mua hàng"
        />

        <SwitchField
          label="Cho phép mua hàng không cần đăng ký"
          checked={settings.allowGuestCheckout}
          onChange={(v) => onChange({ ...settings, allowGuestCheckout: v })}
          description="Khách hàng có thể mua hàng mà không cần tạo tài khoản"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Số lần đăng nhập sai tối đa"
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(v) =>
              onChange({ ...settings, maxLoginAttempts: Number(v) })
            }
            description="Khóa tài khoản sau N lần đăng nhập sai"
          />
          <FormField
            label="Thời gian hết phiên (phút)"
            type="number"
            value={settings.sessionTimeout}
            onChange={(v) =>
              onChange({ ...settings, sessionTimeout: Number(v) })
            }
            description="Tự động đăng xuất sau thời gian không hoạt động"
          />
        </div>
      </div>
    </div>
  );
}

/* ================= Form components ================= */

function FormField({
  label,
  value,
  onChange,
  type = "text",
  icon,
  required,
  placeholder,
  description,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  icon?: React.ReactNode;
  required?: boolean;
  placeholder?: string;
  description?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-neutral-700">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
      {description && (
        <p className="mt-1 text-xs text-neutral-500">{description}</p>
      )}
    </div>
  );
}

function SwitchField({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-neutral-200 p-4">
      <div className="flex-1">
        <p className="text-sm font-semibold text-neutral-800">{label}</p>
        {description && (
          <p className="mt-1 text-xs text-neutral-500">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
          checked ? "bg-black" : "bg-neutral-200"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}