/**
 * This class is for log object changes to lightly sync they with client.
 * This class can log objects with serialize() method and property id.
 * You can't run Loggable() against prototype due to add and remove
 * will operate with prototype as this.
 */

Loggable = function Loggable(object)
{
    if (object) {
        object.sync = Loggable.prototype.sync;
        object.clearRemoved = Loggable.prototype.clearRemoved;
        object.on('add', callback(Loggable.prototype.log, object));
        object.on('remove', callback(Loggable.prototype.log, object));
    }
};

/**
 * This method should be attached to add events of object container.
 * @param event {
 *      object: {
 *          id: int,
 *          serialize: function
 *      },
 *      type: string, // add|change|remove
 *  }
 */
Loggable.prototype.log = function(event)
{
    var data = event.object.serialize();
    var current = this.logData, prev = null;
    while (current != null) {
        if (current.data.id == data.id) {
            // remove current
            if (prev == null) {
                current = this.logData = current.next;
            } else {
                current = prev.next = current.next;
            }
            break;
        } else {
            // to next element
            prev = current;
            current = current.next;
        }
    }
    // insert first element
    var current = {
        time: Date.now(),
        type: event.type,
        data: data
    };
    current.next = this.logData;
    this.logData = current;
    if (event.type == 'add') {
        event.object.on('change', callback(Loggable.prototype.log, this));
    }
};

Loggable.prototype.clearRemoved = function(timestamp)
{
    var current = this.logData, prev = null;
    while (current != null) {
        if (current.type == 'remove' && current.time < timestamp) {
            // remove current
            if (prev == null) {
                current = this.logData = current.next;
            } else {
                current = prev.next = current.next;
            }
        } else {
            // to next element
            prev = current;
            current = current.next;
        }
    }
};

Loggable.prototype.sync = function(lastSync)
{
    var res = [];
    var current = this.logData;
    while (current != null) {
        // as logData is time desc sorted, so walk throw logData while
        // time great than or equal to lastSync and break if:
        if (current.time <= lastSync) { // "<=" to avoid duplicate events
            break;
        }
        res.push({
            type: current.type,
            data: current.data
        });
        // to next element
        current = current.next;
    }
    return res.reverse();
};
