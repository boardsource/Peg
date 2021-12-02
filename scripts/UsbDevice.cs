using Godot;
using System;
using System.Collections.Generic;
using System.Management; // need to add System.Management to your project references.
namespace Peg
{
    // not used/working at this time but if we want to do look ups over usb maybe use this.
    public class UsbDevice
    {

        public UsbDevice()
        {
            GD.Print("usb devices coming up");
            var usbDevices = GetUSBDevices();

            foreach (var usbDevice in usbDevices)
            {
                GD.Print("Device ID:", usbDevice.DeviceID, " PNP Device ID:", usbDevice.PnpDeviceID, " Description:", usbDevice.Description);
            }
        }
        static List<USBDeviceInfo> GetUSBDevices()
        {
            List<USBDeviceInfo> devices = new List<USBDeviceInfo>();

            ManagementObjectCollection collection;
            using (var searcher = new ManagementObjectSearcher(@"Select * From Win32_USBHub"))
                collection = searcher.Get();
            GD.Print(collection);
            foreach (var device in collection)
            {
                devices.Add(new USBDeviceInfo((string)device.GetPropertyValue("DeviceID"), (string)device.GetPropertyValue("PNPDeviceID"), (string)device.GetPropertyValue("Description")));
            }

            collection.Dispose();
            return devices;
        }
    }




    class USBDeviceInfo
    {
        public USBDeviceInfo(string deviceID, string pnpDeviceID, string description)
        {
            this.DeviceID = deviceID;
            this.PnpDeviceID = pnpDeviceID;
            this.Description = description;
        }
        public string DeviceID
        {
            get;
            private set;
        }
        public string PnpDeviceID
        {
            get;
            private set;
        }
        public string Description
        {
            get;
            private set;
        }
    }
}
