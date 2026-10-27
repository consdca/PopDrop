const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem("pd_cart") || "[]"); }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem("pd_cart", JSON.stringify(items));
  },
  add(productId, qty) {
    qty = qty || 1;
    const items = this.get();
    const idx = items.findIndex(i => i.id === productId);
    if (idx > -1) items[idx].qty += qty;
    else items.push({ id: productId, qty });
    this.save(items);
    this.updateBadge();
  },
  remove(productId) {
    const items = this.get().filter(i => i.id !== productId);
    this.save(items);
    this.updateBadge();
  },
  setQty(productId, qty) {
    if (qty <= 0) { this.remove(productId); return; }
    const items = this.get();
    const idx = items.findIndex(i => i.id === productId);
    if (idx > -1) items[idx].qty = qty;
    this.save(items);
    this.updateBadge();
  },
  clear() {
    localStorage.removeItem("pd_cart");
    this.updateBadge();
  },
  totalItems() {
    return this.get().reduce((s, i) => s + i.qty, 0);
  },
  totalPrice() {
    const items = this.get();
    return items.reduce((s, i) => {
      const p = PRODUCTS.find(p => p.id === i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  },
  updateBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    const n = this.totalItems();
    badge.textContent = n;
    badge.style.display = n > 0 ? "flex" : "none";
  }
};

document.addEventListener("DOMContentLoaded", () => Cart.updateBadge());
