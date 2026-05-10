# Security Specification for ShopEasy

## Data Invariants
1. A user can only read and write their own data (profile, orders, notifications, wishlist).
2. Admins can read and write all data.
3. Vendors can manage their own products and see orders that include their products (simplified: admins manage vendors for now).
4. Products and categories are public for reading, but restricted for writing (Admin only).
5. Reviews are public for reading; creation requires being a registered user. Users can only update/delete their own reviews.
6. Orders are private (Owner + Admin).
7. Stock cannot be negative.
8. Prices must be positive numbers.
9. Loyalty points can only be updated by system-like actions (admins or specific triggers).

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to create a user profile with a different UID.
2. **Privilege Escalation**: Attempt to update `role` to 'admin' as a normal user.
3. **Shadow Update**: Add `isAdmin: true` to a profile update payload.
4. **Order Hijacking**: Attempt to read another user's order.
5. **Price Manipulation**: Create an order with `totalAmount: 0.01` for a large cart. (Rules should ideally check against product prices, but for now, we'll focus on ownership).
6. **Negative Stock**: Attempt to set product `stock: -10`.
7. **Malicious Review**: Post a review as another user by spoofing `userId`.
8. **Orphaned Order**: Create an order with a non-existent `userId`.
9. **Notification Spam**: Create a notification for another user.
10. **Wishlist Poisoning**: Update another user's wishlist.
11. **ID Poisoning**: Use a 1.5KB string as a product ID.
12. **Status Shortcut**: Update order status from 'pending' directly to 'delivered' as a user (Users shouldn't update status at all).

## Security Rules Plan
1. `users/{userId}`: `read, write` if `request.auth.uid == userId` or `isAdmin()`.
2. `products/{productId}`: `read` for all; `write` if `isAdmin()`.
3. `orders/{orderId}`: `read` if `request.auth.uid == resource.data.userId` or `isAdmin()`. `create` if `request.auth.uid == request.resource.data.userId`. `update` restricted to specific actions.
4. `categories/{catId}`: `read` for all; `write` if `isAdmin()`.
5. `vendors/{vendorId}`: `read` for all; `write` if `isAdmin()`.
6. `reviews/{reviewId}`: `read` for all; `create` if `isSignedIn()`. `update, delete` if `request.auth.uid == resource.data.userId`.
7. `notifications/{noteId}`: `read` if `request.auth.uid == resource.data.userId`; `write` if `isAdmin()`.
8. `wishlists/{wishId}`: `read, write` if `request.auth.uid == resource.data.userId`.
9. `pricingPlans/{planId}`: `read` for all; `write` if `isAdmin()`.
