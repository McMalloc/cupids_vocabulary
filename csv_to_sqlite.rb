require "csv"
require "rubygems"
require "sequel"
require "pry"



$common_symbols = ["<br", "/>", "-i", "class=\"ilink\"", "href=", "<a", "-", ">", "-", ".", ",", "*", "(", ")", "/", ";", "!", "?", "+", "=", ":"]
$common_words = [ /^my/, /^i'm/, /^i/, /^and/, /the/, /but/, / . /, " so ", " the ", " of ", " and ", " to ", " in ", " for ", " is ", " on ", " that ", " by ", " this ", " with ", " you ", " it ", " not ", " or ", " be ", " are ", " from ", " at ", " as ", " your ", " all ", " have ", " new ", " more ", " an ", " was ", " we ", " will ", " home ", " can ", " us ", " about ", " if ", " page ", " my ", " has ", " search ", " free ", " but ", " our ", " one ", " other ", " do ", " no ", " information ", " time ", " they ", " site ", " he ", " up ", " may ", " what ", " which ", " their ", " news ", " out ", " use ", " any ", " there ", " see ", " only ", " so ", " his ", " when ", " contact ", " here ", " business ", " who ", " web ", " also ", " now ", " help ", " i m ", " just ", " get ", " pm ", " view ", " online ", " first ", " am ", " been ", " would ", " how ", " were ", " me ", " services ", " some ", " these ", " click ", " its ", "\"", " like ", " service ", " x ", " than ", " find ", " i'm ", " it's ", " you're " ]

puts "CSV to sqlite script. CC0 by Robert Wlcek."
# connect to an in-memory database
if File.exists? "_profiles.db"
	File.delete("_profiles.db")
	puts "Old file deleted."
end
DB = Sequel.sqlite("_profiles.db")
items = DB[:items]
puts "Created table."

puts "Loading csv table ..."
csv = CSV.table( "_profiles.csv")
headers = csv.headers()
puts "Loading complete. Inserting rows."
# create an items table
DB.create_table :items do
  primary_key :id
  headers.each do |header|
    String header
  end
end

$total = csv.length.to_f

csv.each_with_index do |row, i|
  record = Hash.new
  if i % 5 == 0 
	print "Progress: " +  ((i / $total) * 100).to_i.to_s + "%\r"
  end
  headers.each_with_index do |header, j|
	# binding.pry
	string = row[j].to_s
	if 5 < j and j < 16
		$common_symbols.each do |symbol|
			string.gsub! symbol, " "
		end
		$common_words.each do |word|
			string.gsub! word, " "
		end
		string.gsub! "  ", " "
		# binding.pry
	end
	
    record[header] = string
  end
  items.insert(record)
end

# create a dataset from the items table
# items = DB[:items]

# populate the table
# items.insert(:name => 'abc', :price => rand * 100)

# print out the number of records
# puts "Item count: #{items.count}"