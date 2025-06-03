const eventRoutes = require('./routes/events');
const pujaRoutes = require('./routes/pujas');
const paymentRoutes = require('./routes/payment');

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/pujas', pujaRoutes);
app.use('/api/payments', paymentRoutes); 