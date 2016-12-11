require "csv"
require "rubygems"
require "sequel"

puts "CSV to sqlite script. CC0 by Robert Wlcek."
# connect to an in-memory database
if File.exists? "profiles.db"
	File.delete("profiles.db")
	puts "Old file deleted."
end
DB = Sequel.sqlite("profiles.db")
items = DB[:items]
puts "Created table."

puts "Loading csv table ..."
csv = CSV.table( "profiles.csv")
headers = csv.headers()
puts "Loading complete. Inserting rows."
# create an items table
DB.create_table :items do
  primary_key :id
  headers.each do |header|
    String header
  end
end

csv.each_with_index do |row, index|
  record = Hash.new
  headers.each_with_index do |header, index|
    record[header] = row[index]
  end
  items.insert(record)
end

# create a dataset from the items table
# items = DB[:items]

# populate the table
# items.insert(:name => 'abc', :price => rand * 100)

# print out the number of records
# puts "Item count: #{items.count}"