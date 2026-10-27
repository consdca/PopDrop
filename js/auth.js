const PopDropAccount = {
  keys: {
    users: "pd_users",
    session: "pd_session",
    orders: "pd_orders",
    inventory: "pd_inventory",
    settings: "pd_admin_settings"
  },

  read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  },

  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  session() {
    return this.read(this.keys.session, null);
  },

  users() {
    return this.read(this.keys.users, []);
  },

  customer() {
    const session = this.session();
    if (!session || session.role !== "customer") return null;
    return this.users().find(user => user.id === session.userId) || null;
  },

  createAccount(data) {
    const users = this.users();
    const email = data.email.trim().toLowerCase();
    if (users.some(user => user.email === email)) {
      return { ok: false, message: "An account already exists for that email." };
    }

    const user = {
      id: "customer-" + Date.now(),
      role: "customer",
      email,
      password: data.password,
      profile: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email,
        phone: "",
        address: "",
        barangay: "",
        city: "",
        province: "",
        postalCode: "",
        favoriteFlavor: "Citrus Soda",
        newsletter: true
      }
    };
    users.push(user);
    this.write(this.keys.users, users);
    this.write(this.keys.session, { role: "customer", userId: user.id });
    return { ok: true };
  },

  signIn(email, password, role) {
    const normalizedEmail = email.trim().toLowerCase();
    if (role === "admin") {
      if (normalizedEmail === "admin@popdrop.com" && password === "PopDropAdmin!") {
        this.write(this.keys.session, { role: "admin", name: "PopDrop Admin" });
        return { ok: true };
      }
      return { ok: false, message: "Admin email or password is incorrect." };
    }

    const user = this.users().find(item =>
      item.email === normalizedEmail && item.password === password
    );
    if (!user) return { ok: false, message: "Email or password is incorrect." };
    this.write(this.keys.session, { role: "customer", userId: user.id });
    return { ok: true };
  },

  signOut() {
    localStorage.removeItem(this.keys.session);
  },

  updateProfile(profile) {
    const session = this.session();
    if (!session || session.role !== "customer") return false;
    const users = this.users();
    const index = users.findIndex(user => user.id === session.userId);
    if (index === -1) return false;
    users[index].profile = { ...users[index].profile, ...profile };
    users[index].email = users[index].profile.email.trim().toLowerCase();
    this.write(this.keys.users, users);
    return true;
  },

  orders() {
    return this.read(this.keys.orders, []);
  },

  recordOrder(order) {
    const session = this.session();
    const orders = this.orders();
    orders.unshift({
      ...order,
      customerId: session && session.role === "customer" ? session.userId : null,
      createdAt: new Date().toISOString(),
      status: "Processing"
    });
    this.write(this.keys.orders, orders);
  },

  inventory(products) {
    const saved = this.read(this.keys.inventory, null);
    if (saved) return saved;
    const initial = products.map(product => ({
      id: product.id,
      stock: 48,
      active: true
    }));
    this.write(this.keys.inventory, initial);
    return initial;
  },

  updateNav() {
    const label = document.getElementById("account-label");
    if (!label) return;
    const session = this.session();
    if (!session) {
      label.textContent = "Sign In";
      return;
    }
    label.textContent = session.role === "admin"
      ? "Admin"
      : (this.customer()?.profile.firstName || "Account");
  }
};

document.addEventListener("DOMContentLoaded", () => PopDropAccount.updateNav());
