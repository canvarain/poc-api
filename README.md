# poc-api
billid poc api

### Really cool stats
All the application components are running on a macbook with following configuration

- 8 GM RAM 1600 MHz DDR3
- Intel core i5 2.6 GHz

Components running
- node process
- MongoDB server
- RabbitMQ message borker

Also some of the RAM is used by browser, terminal, text editor etc.

The application is able to handle 250 requests per second, with total of 20000 requests and with 100 concurrent connections.

By adding clustering logic, the no of requests per second goes up to 550, with a total of 40000 requests and 300 concurrent connections.