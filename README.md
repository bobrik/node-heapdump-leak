node-heapdump-leak
==================

Possible leak in node.js

## How to run

Install everything:

```
git clone git@github.com:bobrik/node-heapdump-leak.git
cd node-heapdump-leak
npm install
```

Run server on port 12345 with redis on default port:

```
node run.js 127.0.0.1 6379 127.0.0.1 12345
```

Check:

```
curl http://127.0.0.1:12345/
GIF89a�������!�
,L;
```

Fire 3 000 000 requests to leak some memory:

```
ab -c 100 -n 3000000 http://127.0.0.1:12345/?n=boo
```

## Results

RSS usage: 93mb (more requests -> more memory used)

Dump heap:

```
kill -USR2 <node pid goes here>
```

Heap dump size: 35mb, when opened in chrome: 4.8mb.

If you fire 20 000 000 reuqests, heap dump increases, rss increases, chrome shows the same.
Moreover, requests become slower (3ms in the beginning, up to 500ms when heap dump is around 250mb).

## Some GC numbers

In production similar server shows:


Before gc():

* process.memoryUsage()

```json
{"rss":265080832,"heapTotal":56172032,"heapUsed":8697768}
```

* getV8Statistics()

```json
{
    "total_committed_bytes": 57688064,
    "new_space_live_bytes": 4027464,
    "new_space_available_bytes": 12749592,
    "new_space_commited_bytes": 33554432,
    "old_pointer_space_live_bytes": 2159320,
    "old_pointer_space_available_bytes": 12812072,
    "old_pointer_space_commited_bytes": 14971392,
    "old_data_space_live_bytes": 1095272,
    "old_data_space_available_bytes": 1165208,
    "old_data_space_commited_bytes": 2260480,
    "code_space_live_bytes": 1219904,
    "code_space_available_bytes": 1839808,
    "code_space_commited_bytes": 3059712,
    "cell_space_live_bytes": 31120,
    "cell_space_available_bytes": 99952,
    "cell_space_commited_bytes": 131072,
    "lo_space_live_bytes": 0,
    "lo_space_available_bytes": 1476361984,
    "lo_space_commited_bytes": 0,
    "amount_of_external_allocated_memory": 1081624
}
```

After gc():

* process.memoryUsage()

```json
{"rss":258056192,"heapTotal":49980416,"heapUsed":4513704}
```

* getV8Statistics()

```json
{
    "total_committed_bytes": 51396608,
    "new_space_live_bytes": 2080,
    "new_space_available_bytes": 16774976,
    "new_space_commited_bytes": 33554432,
    "old_pointer_space_live_bytes": 2127400,
    "old_pointer_space_available_bytes": 6652376,
    "old_pointer_space_commited_bytes": 8779776,
    "old_data_space_live_bytes": 1802640,
    "old_data_space_available_bytes": 457840,
    "old_data_space_commited_bytes": 2260480,
    "code_space_live_bytes": 1145440,
    "code_space_available_bytes": 1914272,
    "code_space_commited_bytes": 3059712,
    "cell_space_live_bytes": 30304,
    "cell_space_available_bytes": 100768,
    "cell_space_commited_bytes": 131072,
    "lo_space_live_bytes": 0,
    "lo_space_available_bytes": 1482653440,
    "lo_space_commited_bytes": 0,
    "amount_of_external_allocated_memory": 1065128
}
```

## Related

* [Connected issue](https://github.com/joyent/node/issues/4217)
